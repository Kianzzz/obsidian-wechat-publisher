import { App, Plugin, PluginSettingTab, Setting, Notice, WorkspaceLeaf, FuzzySuggestModal, normalizePath } from 'obsidian';
import { PluginSettings, DEFAULT_SETTINGS, WeChatAccount, ResolvedWeChatAccount, ResolvedProxyConfig } from './types';
import { PublisherView, VIEW_TYPE_PUBLISHER } from './views/publisher-view';
import { AccountModal } from './modals/account-modal';
import { getAccessToken } from './services/weixin-api';

// 文件夹选择模态框
class FolderSuggestModal extends FuzzySuggestModal<string> {
	folderPaths: string[];
	onChoose: (path: string) => void;

	constructor(app: App, folderPaths: string[], onChoose: (path: string) => void) {
		super(app);
		this.folderPaths = folderPaths;
		this.onChoose = onChoose;
		this.setPlaceholder('输入文件夹名称进行搜索...');
	}

	getItems(): string[] {
		return this.folderPaths;
	}

	getItemText(item: string): string {
		return item;
	}

	onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
		this.onChoose(item);
	}
}

export default class WeChatPublisherPlugin extends Plugin {
	settings: PluginSettings;
	statusCheckInterval: number | null = null;

	async onload() {
		await this.loadSettings();

		// Register the publisher view
		this.registerView(
			VIEW_TYPE_PUBLISHER,
			(leaf) => new PublisherView(leaf, this)
		);

		// Add ribbon icon
		this.addRibbonIcon('message-circle', '微信公众号发布', () => {
			this.activateView();
		});

		// Add command to open publisher
		this.addCommand({
			id: 'open-publisher',
			name: '打开微信公众号发布面板',
			callback: () => {
				this.activateView();
			}
		});

		// Add settings tab
		this.addSettingTab(new WeChatPublisherSettingTab(this.app, this));

		// Start auto-check for token status
		this.startAutoCheck();
	}

	onunload() {
		this.stopAutoCheck();
	}

	async loadSettings() {
		const saved = await this.loadData() as Partial<PluginSettings> | null;
		this.settings = {
			...DEFAULT_SETTINGS,
			...(saved ?? {}),
			accounts: saved?.accounts ?? [],
			publishHistory: saved?.publishHistory ?? []
		};
		await this.migrateLegacySecrets();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private secretId(accountId: string, kind: 'app-secret' | 'access-token' | 'proxy-password'): string {
		const safeAccountId = accountId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
		return `wechat-multi-publisher-${safeAccountId}-${kind}`;
	}

	getAppSecret(account: WeChatAccount): string {
		return this.app.secretStorage.getSecret(account.appSecretId || this.secretId(account.id, 'app-secret')) ?? '';
	}

	getAccessToken(account: WeChatAccount): string | undefined {
		const value = this.app.secretStorage.getSecret(account.accessTokenId || this.secretId(account.id, 'access-token'));
		return value || undefined;
	}

	getProxyPassword(account: WeChatAccount): string | undefined {
		if (!account.proxyConfig) return undefined;
		const id = account.proxyConfig.passwordSecretId || this.secretId(account.id, 'proxy-password');
		const value = this.app.secretStorage.getSecret(id);
		return value || undefined;
	}

	storeAccountSecrets(account: WeChatAccount, appSecret: string, proxyPassword?: string, accessToken?: string): void {
		account.appSecretId = account.appSecretId || this.secretId(account.id, 'app-secret');
		account.accessTokenId = account.accessTokenId || this.secretId(account.id, 'access-token');
		this.app.secretStorage.setSecret(account.appSecretId, appSecret);
		if (accessToken !== undefined) {
			this.app.secretStorage.setSecret(account.accessTokenId, accessToken);
		}
		if (account.proxyConfig) {
			account.proxyConfig.passwordSecretId = account.proxyConfig.passwordSecretId || this.secretId(account.id, 'proxy-password');
			if (proxyPassword !== undefined) {
				this.app.secretStorage.setSecret(account.proxyConfig.passwordSecretId, proxyPassword);
			}
		}
	}

	setAccessToken(account: WeChatAccount, token: string): void {
		account.accessTokenId = account.accessTokenId || this.secretId(account.id, 'access-token');
		this.app.secretStorage.setSecret(account.accessTokenId, token);
		account.tokenExpireTime = Date.now() + 7200 * 1000;
	}

	resolveAccount(account: WeChatAccount): ResolvedWeChatAccount {
		const proxyConfig: ResolvedProxyConfig | undefined = account.proxyConfig ? {
			type: account.proxyConfig.type,
			host: account.proxyConfig.host,
			port: account.proxyConfig.port,
			username: account.proxyConfig.username,
			password: this.getProxyPassword(account)
		} : undefined;
		return {
			...account,
			appsecret: this.getAppSecret(account),
			accessToken: this.getAccessToken(account),
			proxyConfig
		};
	}

	deleteAccountSecrets(account: WeChatAccount): void {
		const ids = [
			account.appSecretId,
			account.accessTokenId,
			account.proxyConfig?.passwordSecretId
		].filter((id): id is string => Boolean(id));
		for (const id of ids) this.app.secretStorage.setSecret(id, '');
	}

	private async migrateLegacySecrets(): Promise<void> {
		let changed = false;
		for (const account of this.settings.accounts) {
			account.appSecretId = account.appSecretId || this.secretId(account.id, 'app-secret');
			account.accessTokenId = account.accessTokenId || this.secretId(account.id, 'access-token');
			if (account.appsecret) {
				this.app.secretStorage.setSecret(account.appSecretId, account.appsecret);
				delete account.appsecret;
				changed = true;
			}
			if (account.accessToken) {
				this.app.secretStorage.setSecret(account.accessTokenId, account.accessToken);
				delete account.accessToken;
				changed = true;
			}
			if (account.proxyConfig) {
				account.proxyConfig.passwordSecretId = account.proxyConfig.passwordSecretId || this.secretId(account.id, 'proxy-password');
				if (account.proxyConfig.password) {
					this.app.secretStorage.setSecret(account.proxyConfig.passwordSecretId, account.proxyConfig.password);
					delete account.proxyConfig.password;
					changed = true;
				}
			}
		}
		if (changed) await this.saveSettings();
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_PUBLISHER);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({
				type: VIEW_TYPE_PUBLISHER,
				active: true,
			});
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	startAutoCheck() {
		if (this.statusCheckInterval) {
			clearInterval(this.statusCheckInterval);
		}

		this.statusCheckInterval = window.setInterval(async () => {
			await this.checkAllAccountsStatus();
		}, this.settings.autoCheckInterval);
		this.registerInterval(this.statusCheckInterval);
	}

	stopAutoCheck() {
		if (this.statusCheckInterval) {
			clearInterval(this.statusCheckInterval);
			this.statusCheckInterval = null;
		}
	}

	async checkAllAccountsStatus() {
		for (const account of this.settings.accounts) {
			await this.checkAccountStatus(account);
		}
		await this.saveSettings();
	}

	async checkAccountStatus(account: WeChatAccount) {
		// Check if access token is expired or missing
		const resolved = this.resolveAccount(account);
		if (!resolved.accessToken || !account.tokenExpireTime || Date.now() >= account.tokenExpireTime) {
			// Try to refresh token
			try {
				if (!resolved.appsecret) throw new Error('缺少 AppSecret');
				const token = await getAccessToken(account.appid, resolved.appsecret, resolved.proxyConfig);
				this.setAccessToken(account, token);
				account.status = 'online';
				account.lastCheckTime = new Date().toISOString();
			} catch (error) {
				account.status = 'expired';
				account.lastCheckTime = new Date().toISOString();
			}
		} else {
			// Token is still valid
			account.status = 'online';
			account.lastCheckTime = new Date().toISOString();
		}
	}
}

class WeChatPublisherSettingTab extends PluginSettingTab {
	plugin: WeChatPublisherPlugin;

	constructor(app: App, plugin: WeChatPublisherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Max concurrent publish
		new Setting(containerEl)
			.setName('最大并发发布数')
			.setDesc('同时发布的公众号数量')
			.addSlider(slider => slider
				.setLimits(1, 5, 1)
				.setValue(this.plugin.settings.maxConcurrent)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.maxConcurrent = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('排除笔记属性')
			.setDesc('排版和发布时不包含 YAML frontmatter')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.excludeFrontmatter)
				.onChange(async value => {
					this.plugin.settings.excludeFrontmatter = value;
					await this.plugin.saveSettings();
				}));

		const coverSetting = new Setting(containerEl)
			.setName('默认封面图片')
			.setDesc('没有临时封面时使用，最大 2 MB');
		if (this.plugin.settings.defaultCoverImage) {
			coverSetting.addButton(button => button
				.setButtonText('删除默认封面')
				.setWarning()
				.onClick(async () => {
					this.plugin.settings.defaultCoverImage = '';
					await this.plugin.saveSettings();
					this.display();
				}));
			const preview = containerEl.createDiv({ cls: 'default-cover-preview' });
			preview.createEl('img', {
				attr: { src: this.plugin.settings.defaultCoverImage, alt: '默认封面' }
			});
		} else {
			coverSetting.addButton(button => button
				.setButtonText('上传默认封面')
				.onClick(() => this.chooseDefaultCover()));
		}

		// Auto check interval
		new Setting(containerEl)
			.setName('自动检测间隔（小时）')
			.setDesc('自动检测 Access Token 状态的时间间隔')
			.addSlider(slider => slider
				.setLimits(1, 24, 1)
				.setValue(this.plugin.settings.autoCheckInterval / 3600000)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.autoCheckInterval = value * 3600000;
					await this.plugin.saveSettings();
					this.plugin.startAutoCheck();
				}));

		// CSS themes folder
		new Setting(containerEl)
			.setName('CSS 样式文件夹')
			.setDesc('点击下方按钮选择文件夹，或手动输入路径')
			.addText(text => text
				.setPlaceholder('点击下方"选择文件夹"按钮')
				.setValue(this.plugin.settings.themesFolder)
				.onChange((value) => {
					this.plugin.settings.themesFolder = normalizePath(value);
				}))
			.addButton(button => button
				.setButtonText('选择文件夹')
				.onClick(async () => {
					// 创建文件夹选择模态框
					const folders = this.getAllFolders(this.app.vault.getRoot());
					const folderPaths = folders.map(f => f.path).sort();

					// 创建简单的选择界面
					const modal = new FolderSuggestModal(this.app, folderPaths, async (selectedPath) => {
						this.plugin.settings.themesFolder = selectedPath;
						await this.plugin.saveSettings();

						// 刷新显示
						this.display();

						// 刷新所有发布视图
						const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_PUBLISHER);
						for (const leaf of leaves) {
							const view = leaf.view as PublisherView;
							if (view) {
								view.themeManager.setThemesFolder(selectedPath);
								await view.themeManager.loadThemes();
								view.render();
							}
						}
					});
					modal.open();
				}))
			.addButton(button => button
				.setButtonText('保存并应用')
				.setCta()
				.onClick(async () => {
					await this.plugin.saveSettings();

					// Refresh all publisher views
					const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_PUBLISHER);
					for (const leaf of leaves) {
						const view = leaf.view as PublisherView;
						if (view) {
							view.themeManager.setThemesFolder(this.plugin.settings.themesFolder);
							await view.themeManager.loadThemes();
							view.render();
						}
					}
				}));

		// Account management section
		new Setting(containerEl).setName('公众号账号').setHeading();

		// Add account button
		new Setting(containerEl)
			.setName('添加新账号')
			.setDesc('添加一个新的微信公众号')
			.addButton(button => button
				.setButtonText('添加账号')
				.setCta()
				.onClick(() => {
					const modal = new AccountModal(this.app, this.plugin, null, async (account) => {
						this.plugin.settings.accounts.push(account);
						await this.plugin.saveSettings();
						this.display();
						new Notice(`账号 "${account.name}" 添加成功`);
					});
					modal.open();
				}));

		// List existing accounts
		for (const account of this.plugin.settings.accounts) {
			this.displayAccountSetting(containerEl, account);
		}
	}

	private chooseDefaultCover(): void {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg,image/png';
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return;
			if (file.size > 2 * 1024 * 1024) {
				new Notice('图片大小不能超过 2 MB');
				return;
			}
			const reader = new FileReader();
			reader.onload = async () => {
				this.plugin.settings.defaultCoverImage = String(reader.result ?? '');
				await this.plugin.saveSettings();
				this.display();
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	displayAccountSetting(containerEl: HTMLElement, account: WeChatAccount) {
		const accountDiv = containerEl.createDiv({ cls: 'wechat-account-item' });

		const statusIcon = account.status === 'online' ? '✅' :
						  account.status === 'expired' ? '⚠️' : '❌';

		new Setting(accountDiv)
			.setName(`${statusIcon} ${account.name}`)
			.setDesc(account.remark || '暂无备注')
			.addButton(button => button
				.setButtonText('编辑')
				.onClick(() => {
					const modal = new AccountModal(this.app, this.plugin, account, async (updatedAccount) => {
						const index = this.plugin.settings.accounts.findIndex(a => a.id === account.id);
						if (index !== -1) {
							this.plugin.settings.accounts[index] = updatedAccount;
							await this.plugin.saveSettings();
							this.display();
						}
					});
					modal.open();
				}))
			.addButton(button => button
				.setButtonText('刷新')
				.onClick(async () => {
					new Notice('正在刷新 Access Token...');
					await this.plugin.checkAccountStatus(account);
					await this.plugin.saveSettings();
					this.display();

					if (account.status === 'online') {
						new Notice('✅ Access Token 刷新成功');
					} else {
						new Notice('❌ Access Token 刷新失败，请检查 AppID 和 AppSecret');
					}
				}))
			.addButton(button => button
				.setButtonText('删除')
				.setWarning()
				.onClick(async () => {
					if (confirm(`确定要删除账号 "${account.name}" 吗？`)) {
						this.plugin.deleteAccountSecrets(account);
						this.plugin.settings.accounts = this.plugin.settings.accounts.filter(a => a.id !== account.id);
						await this.plugin.saveSettings();
						this.display();
						new Notice(`账号 "${account.name}" 已删除`);
					}
				}));
	}

	// 获取所有文件夹的辅助方法
	getAllFolders(folder: any): any[] {
		let folders: any[] = [];

		for (const child of folder.children) {
			if (child.children) { // 是文件夹
				folders.push(child);
				folders = folders.concat(this.getAllFolders(child));
			}
		}

		return folders;
	}
}
