import { App, Modal, Notice, Setting } from 'obsidian';
import { WeChatAccount, ProxyConfig } from '../types';
import { getAccessToken, testProxy } from '../services/weixin-api';
import WeChatPublisherPlugin from '../main';

export class AccountModal extends Modal {
	plugin: WeChatPublisherPlugin;
	account: WeChatAccount | null;
	isEdit: boolean;
	onSubmit: (account: WeChatAccount) => void;

	// Form fields
	nameInput: string = '';
	remarkInput: string = '';
	appidInput: string = '';
	appsecretInput: string = '';

	// Proxy fields
	proxyType: 'socks5' | 'http' | 'https' = 'http';
	proxyHost: string = '';
	proxyPort: number = 1080;
	proxyUsername: string = '';
	proxyPassword: string = '';

	constructor(
		app: App,
		plugin: WeChatPublisherPlugin,
		account: WeChatAccount | null,
		onSubmit: (account: WeChatAccount) => void
	) {
		super(app);
		this.plugin = plugin;
		this.account = account;
		this.isEdit = account !== null;
		this.onSubmit = onSubmit;

		// Load existing values if editing
		if (this.isEdit && account) {
			this.nameInput = account.name;
			this.remarkInput = account.remark || '';
			this.appidInput = account.appid;
			this.appsecretInput = '';

			if (account.proxyConfig) {
				this.proxyType = account.proxyConfig.type;
				this.proxyHost = account.proxyConfig.host;
				this.proxyPort = account.proxyConfig.port;
				this.proxyUsername = account.proxyConfig.username || '';
				this.proxyPassword = '';
			}
		}
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		this.setTitle(this.isEdit ? '编辑账号' : '添加新账号');

		// Account Name
		new Setting(contentEl)
			.setName('账号名称')
			.setDesc('便于识别的名称')
			.addText(text => text
				.setPlaceholder('我的公众号')
				.setValue(this.nameInput)
				.onChange((value) => {
					this.nameInput = value;
				}));

		// Remark
		new Setting(contentEl)
			.setName('备注')
			.setDesc('可选的说明或注释')
			.addTextArea(text => text
				.setPlaceholder('账号用途说明...')
				.setValue(this.remarkInput)
				.onChange((value) => {
					this.remarkInput = value;
				}));

		// AppID
		new Setting(contentEl)
			.setName('AppID')
			.setDesc('微信公众号开发者 AppID')
			.addText(text => text
				.setPlaceholder('请输入公众号 AppID')
				.setValue(this.appidInput)
				.onChange((value) => {
					this.appidInput = value;
				}));

		// AppSecret
		new Setting(contentEl)
			.setName('AppSecret')
			.setDesc(this.isEdit ? '留空表示保留现有 AppSecret' : '微信公众号开发者 AppSecret')
			.addText(text => {
				text.setPlaceholder('请输入 AppSecret')
					.setValue(this.appsecretInput)
					.onChange((value) => {
						this.appsecretInput = value;
					});
				text.inputEl.type = 'password';
			});

		// Proxy section header
		new Setting(contentEl).setName('代理配置（可选）').setHeading();

		// Proxy Type
		new Setting(contentEl)
			.setName('代理类型')
			.setDesc('选择代理协议类型')
			.addDropdown(dropdown => dropdown
				.addOption('http', 'HTTP（推荐，支持认证）')
				.addOption('https', 'HTTPS（支持认证）')
				.addOption('socks5', 'SOCKS5（不支持认证）')
				.setValue(this.proxyType)
				.onChange((value: 'socks5' | 'http' | 'https') => {
					this.proxyType = value;
				}));

		// Proxy Host
		new Setting(contentEl)
			.setName('代理服务器地址')
			.setDesc('可选：代理服务器地址（如：c1023.ips5.vip）留空则使用本地网络')
			.addText(text => text
				.setPlaceholder('c1023.ips5.vip')
				.setValue(this.proxyHost)
				.onChange((value) => {
					this.proxyHost = value;
				}));

		// Proxy Port
		new Setting(contentEl)
			.setName('代理端口')
			.setDesc('可选：代理服务器端口（如：9125）')
			.addText(text => text
				.setPlaceholder('9125')
				.setValue(this.proxyPort.toString())
				.onChange((value) => {
					const port = parseInt(value);
					if (!isNaN(port)) {
						this.proxyPort = port;
					}
				}));

		// Proxy Username (conditional)
		const isAuthSupported = this.proxyType === 'http' || this.proxyType === 'https';
		new Setting(contentEl)
			.setName('代理用户名')
			.setDesc(isAuthSupported ? '可选：代理服务器认证用户名' : '❌ SOCKS5 代理不支持认证')
			.addText(text => text
				.setPlaceholder('用户名')
				.setValue(this.proxyUsername)
				.setDisabled(!isAuthSupported)
				.onChange((value) => {
					this.proxyUsername = value;
				}));

		// Proxy Password (conditional)
		new Setting(contentEl)
			.setName('代理密码')
			.setDesc(isAuthSupported ? (this.isEdit ? '留空表示保留现有代理密码' : '可选：代理服务器认证密码') : 'SOCKS5 代理不支持认证')
			.addText(text => {
				text.setPlaceholder('密码')
					.setValue(this.proxyPassword)
					.setDisabled(!isAuthSupported)
					.onChange((value) => {
						this.proxyPassword = value;
					});
				text.inputEl.type = 'password';
			});

		// Test proxy button
		new Setting(contentEl)
			.setName('测试代理连接')
			.setDesc('验证代理配置是否正常工作')
			.addButton(button => button
				.setButtonText('测试连接')
				.onClick(async () => {
					await this.testProxyConnection();
				}));

		// Test API Configuration button
		new Setting(contentEl)
			.setName('测试 API 配置')
			.setDesc('验证 AppID 和 AppSecret 是否有效')
			.addButton(button => button
				.setButtonText('测试 API')
				.onClick(async () => {
					await this.testAccessToken();
				}));

		// Buttons
		const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

		buttonContainer.createEl('button', { text: '取消', cls: 'mod-cancel' })
			.addEventListener('click', () => {
				this.close();
			});

		const saveButton = buttonContainer.createEl('button', {
			text: this.isEdit ? '保存修改' : '保存',
			cls: 'mod-cta'
		});
		saveButton.addEventListener('click', async () => {
			await this.handleSave();
		});
	}

	async testProxyConnection() {
		if (!this.proxyHost || !this.proxyPort) {
			new Notice('代理未配置，将使用本地网络连接');
			return;
		}

		const proxyConfig: ProxyConfig = {
			type: this.proxyType,
			host: this.proxyHost,
			port: this.proxyPort,
			username: this.proxyUsername || undefined,
			password: this.proxyPassword || undefined
		};

		new Notice('正在测试代理连接...');

		const response = await testProxy(proxyConfig);

		if (response.success) {
			new Notice(`✅ 代理连接成功！延迟：${response.latency}ms`);
		} else {
			new Notice(`❌ 代理连接失败：${response.error}`);
		}
	}

	async testAccessToken() {
		if (!this.appidInput.trim()) {
			new Notice('请输入 AppID');
			return;
		}

		const appSecret = this.appsecretInput.trim() || (this.account ? this.plugin.getAppSecret(this.account) : '');
		if (!appSecret) {
			new Notice('请输入 AppSecret');
			return;
		}

		let proxyConfig: ProxyConfig | undefined = undefined;
		if (this.proxyHost && this.proxyPort) {
			proxyConfig = {
				type: this.proxyType,
				host: this.proxyHost,
				port: this.proxyPort,
				username: this.proxyUsername || undefined,
				password: this.proxyPassword || (this.account ? this.plugin.getProxyPassword(this.account) : undefined)
			};
		}

		new Notice('正在测试 Access Token...');

		try {
			const token = await getAccessToken(
				this.appidInput.trim(),
				appSecret,
				proxyConfig
			);

			if (!token) throw new Error('微信接口未返回 Access Token');
			new Notice('✅ Access Token 获取成功');
		} catch (error) {
			new Notice(`❌ 获取 Access Token 失败：${error.message}`);
		}
	}

	async handleSave() {
		// Validate required fields
		if (!this.nameInput.trim()) {
			new Notice('请输入账号名称');
			return;
		}

		if (!this.appidInput.trim()) {
			new Notice('请输入 AppID');
			return;
		}

		const appSecret = this.appsecretInput.trim() || (this.account ? this.plugin.getAppSecret(this.account) : '');
		if (!appSecret) {
			new Notice('请输入 AppSecret');
			return;
		}

		// Build proxy config (optional)
		let proxyConfig: ProxyConfig | undefined = undefined;
		if (this.proxyHost && this.proxyPort) {
			proxyConfig = {
				type: this.proxyType,
				host: this.proxyHost,
				port: this.proxyPort,
				username: this.proxyUsername || undefined,
				passwordSecretId: this.account?.proxyConfig?.passwordSecretId
			};
		}

		// Create account object
		const account: WeChatAccount = {
			id: this.account?.id || `account-${Date.now()}`,
			name: this.nameInput.trim(),
			remark: this.remarkInput.trim() || undefined,
			appid: this.appidInput.trim(),
			appSecretId: this.account?.appSecretId || '',
			accessTokenId: this.account?.accessTokenId,
			proxyConfig,
			status: 'offline',
			lastCheckTime: this.account?.lastCheckTime
		};

		// Test access token before saving
		new Notice('验证 Access Token...');
		try {
			const token = await getAccessToken(
				account.appid,
				appSecret,
				proxyConfig ? {
					...proxyConfig,
					password: this.proxyPassword || (this.account ? this.plugin.getProxyPassword(this.account) : undefined)
				} : undefined
			);

			// Save token and expiration (WeChat tokens expire in 7200 seconds)
			this.plugin.storeAccountSecrets(
				account,
				appSecret,
				this.proxyPassword || (this.account ? this.plugin.getProxyPassword(this.account) : undefined),
				token
			);
			account.tokenExpireTime = Date.now() + 7200 * 1000;
			account.status = 'online';

			this.onSubmit(account);
			this.close();
			new Notice('账号保存成功');
		} catch (error) {
			new Notice(`❌ 验证失败：${error.message}`);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
