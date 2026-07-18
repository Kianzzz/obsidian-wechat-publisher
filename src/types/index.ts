export interface ProxyConfig {
	type: 'socks5' | 'http' | 'https';
	host: string;
	port: number;
	username?: string;
	passwordSecretId?: string;
	/** @deprecated Migrated to Obsidian SecretStorage on first load. */
	password?: string;
}

export interface WeChatAccount {
	id: string;
	name: string;
	remark?: string;
	appid: string;
	appSecretId: string;
	proxyConfig?: ProxyConfig;
	accessTokenId?: string;
	tokenExpireTime?: number;
	lastCheckTime?: string;
	status: 'online' | 'expired' | 'offline' | 'error';
	/** @deprecated Migrated to Obsidian SecretStorage on first load. */
	appsecret?: string;
	/** @deprecated Migrated to Obsidian SecretStorage on first load. */
	accessToken?: string;
}

export interface ResolvedProxyConfig extends Omit<ProxyConfig, 'passwordSecretId'> {
	password?: string;
}

export interface ResolvedWeChatAccount extends Omit<WeChatAccount, 'proxyConfig'> {
	appsecret: string;
	accessToken?: string;
	proxyConfig?: ResolvedProxyConfig;
}

export interface PublishHistory {
	time: string;
	articleTitle: string;
	accountIds: string[];
	successCount: number;
	failCount: number;
}

export interface PluginSettings {
	accounts: WeChatAccount[];
	publishHistory: PublishHistory[];
	maxConcurrent: number;
	autoCheckInterval: number;
	themesFolder: string;      // CSS主题文件夹路径
	defaultTheme: string;      // 默认选中的主题名称
	excludeFrontmatter: boolean;
	defaultCoverImage: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	accounts: [],
	publishHistory: [],
	maxConcurrent: 3,
	autoCheckInterval: 3600000, // 1 hour
	themesFolder: '',
	defaultTheme: '默认',
	excludeFrontmatter: false,
	defaultCoverImage: ''
};

export interface PublishRequest {
	accountId: string;
	title: string;
	content: string;
	cover?: {
		path?: string;
		base64?: string;
	};
	appid: string;
	appsecret: string;
	proxyConfig?: ProxyConfig;
}

export interface PublishResponse {
	success: boolean;
	duration: number;
	error?: string;
	errorCode?: string;
}

export type AccountStatus = 'idle' | 'pending' | 'publishing' | 'success' | 'failed';

export interface PublishProgress {
	accountId: string;
	status: AccountStatus;
	duration?: number;
	error?: string;
}
