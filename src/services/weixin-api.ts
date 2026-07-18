/**
 * 微信公众号 API 服务
 * 支持代理配置
 */

import { requestUrl, RequestUrlParam } from 'obsidian';
import { ResolvedProxyConfig } from '../types';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

// 使用 Node.js 原生模块，避免 CORS 问题
const http = require('http');
const https = require('https');

/**
 * 发起带代理的请求
 * 使用 Node.js 原生 http/https 模块确保代理在 Electron 环境中正常工作
 */
async function requestWithProxy(
	url: string,
	options: RequestUrlParam,
	proxyConfig?: ResolvedProxyConfig
): Promise<any> {
	// 如果没有配置代理或未启用,使用默认方式
	if (!proxyConfig || !proxyConfig.host || !proxyConfig.port) {
		const response = await requestUrl(options);
		return {
			status: response.status,
			json: response.json,
			text: response.text
		};
	}

	try {
		// 构建代理 URL 和 agent
		const auth = proxyConfig.username && proxyConfig.password
			? `${encodeURIComponent(proxyConfig.username)}:${encodeURIComponent(proxyConfig.password)}@`
			: "";

		let agent: any;
		if (proxyConfig.type === "socks5") {
			const proxyUrl = `socks5h://${auth}${proxyConfig.host}:${proxyConfig.port}`;
			agent = new SocksProxyAgent(proxyUrl);
		} else {
			const protocol = proxyConfig.type || "http";
			const proxyUrl = `${protocol}://${auth}${proxyConfig.host}:${proxyConfig.port}`;
			agent = new HttpsProxyAgent(proxyUrl);
		}

		// 使用 Node.js 原生 http/https 模块（避免 axios 的 CORS 问题）
		const targetUrl = new URL(options.url || url);
		const isHttps = targetUrl.protocol === 'https:';
		const requestModule = isHttps ? https : http;

		const requestOptions = {
			hostname: targetUrl.hostname,
			port: targetUrl.port || (isHttps ? 443 : 80),
			path: targetUrl.pathname + targetUrl.search,
			method: options.method || 'GET',
			headers: options.headers || {},
			agent: agent
		};

		// 设置 Content-Type
		if (options.contentType) {
			requestOptions.headers['Content-Type'] = options.contentType;
		}

		// 如果有请求体，设置 Content-Length
		if (options.body) {
			if (typeof options.body === 'string') {
				requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body).toString();
			}
		}

		// 发送请求
		return new Promise((resolve, reject) => {
			const req = requestModule.request(requestOptions, (res: any) => {
				let data = '';

				res.on('data', (chunk: any) => {
					data += chunk;
				});

				res.on('end', () => {
					try {
						let jsonData = null;
						try {
							jsonData = JSON.parse(data);
						} catch (e) {
							// 如果不是JSON，保持原样
							jsonData = data;
						}

						resolve({
							status: res.statusCode,
							headers: res.headers,
							text: data,
							json: jsonData
						});
					} catch (error) {
						reject(error);
					}
				});
			});

			req.on('error', (error: Error) => {
				console.error("[requestWithProxy] 代理请求失败:", error.message);
				reject(error);
			});

			// 如果有请求体，写入
			if (options.body) {
				req.write(options.body);
			}

			req.end();
		});

	} catch (error: any) {
		console.error("[requestWithProxy] 代理请求失败:", error.message);
		// 不要 fallback 到直连，直接抛出错误
		// 这样用户才知道代理配置有问题
		throw new Error(`代理请求失败: ${error.message}`);
	}
}

/**
 * 获取 Access Token
 */
export async function getAccessToken(appid: string, secret: string, proxyConfig?: ResolvedProxyConfig): Promise<string> {
	const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;

	try {
		const response = await requestWithProxy(url, {
			url,
			method: 'GET'
		}, proxyConfig);

		if (response.json.access_token) {
			return response.json.access_token;
		} else {
			const errmsg = response.json.errmsg || '获取 Access Token 失败';
			throw new Error(errmsg);
		}
	} catch (error) {
		throw error;
	}
}

/**
 * 上传图片素材
 */
export async function uploadImage(
	imageData: ArrayBuffer,
	filename: string,
	accessToken: string,
	proxyConfig?: ResolvedProxyConfig
): Promise<{ media_id: string; url: string }> {
	const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`;

	try {
		// 将 ArrayBuffer 转换为 Buffer
		const buffer = Buffer.from(imageData);

		// 如果没有代理，使用 form-data 的 submit 方法
		if (!proxyConfig || !proxyConfig.host || !proxyConfig.port) {
			const FormData = require('form-data');
			const formData = new FormData();
			formData.append('media', buffer, {
				filename: filename,
				contentType: 'image/jpeg'
			});

			return new Promise((resolve, reject) => {
				formData.submit(url, (err: Error, res: any) => {
					if (err) {
						reject(err);
						return;
					}

					let data = '';
					res.on('data', (chunk: any) => {
						data += chunk;
					});

					res.on('end', () => {
						try {
							const result = JSON.parse(data);
							if (result.media_id) {
								resolve(result);
							} else {
								reject(new Error(result.errmsg || '上传图片失败'));
							}
						} catch (e) {
							reject(e);
						}
					});
				});
			});
		}

		// 使用代理时，手动构建请求
		const https = require('https');
		const http = require('http');
		const { HttpsProxyAgent } = require('https-proxy-agent');
		const { SocksProxyAgent } = require('socks-proxy-agent');
		const FormData = require('form-data');

		// 创建代理agent
		let agent: any;
		if (proxyConfig.type === 'socks5') {
			const auth = proxyConfig.username && proxyConfig.password
				? `${encodeURIComponent(proxyConfig.username)}:${encodeURIComponent(proxyConfig.password)}@`
				: '';
			const proxyUrl = `socks5h://${auth}${proxyConfig.host}:${proxyConfig.port}`;
			agent = new SocksProxyAgent(proxyUrl);
		} else {
			const auth = proxyConfig.username && proxyConfig.password
				? `${encodeURIComponent(proxyConfig.username)}:${encodeURIComponent(proxyConfig.password)}@`
				: '';
			const protocol = proxyConfig.type || 'http';
			const proxyUrl = `${protocol}://${auth}${proxyConfig.host}:${proxyConfig.port}`;
			agent = new HttpsProxyAgent(proxyUrl);
		}

		const formData = new FormData();
		formData.append('media', buffer, {
			filename: filename,
			contentType: 'image/jpeg'
		});

		const requestModule = url.startsWith('https') ? https : http;

		return new Promise((resolve, reject) => {
			const requestOptions = {
				method: 'POST',
				headers: formData.getHeaders(),
				agent: agent
			};

			const req = requestModule.request(url, requestOptions, (res: any) => {
				let data = '';
				res.on('data', (chunk: any) => {
					data += chunk;
				});

				res.on('end', () => {
					try {
						const result = JSON.parse(data);
						if (result.media_id) {
							resolve(result);
						} else {
							reject(new Error(result.errmsg || '上传图片失败'));
						}
					} catch (e) {
						reject(e);
					}
				});
			});

			req.on('error', (err: Error) => {
				reject(err);
			});

			// 使用 formData 的 pipe 方法发送数据
			formData.pipe(req);
		});
	} catch (error) {
		throw error;
	}
}

/**
 * 创建草稿
 */
export async function addDraft(
	articles: any[],
	accessToken: string,
	proxyConfig?: ResolvedProxyConfig
): Promise<{ media_id: string }> {
	const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;

	try {
		const response = await requestWithProxy(url, {
			url,
			method: 'POST',
			contentType: 'application/json',
			body: JSON.stringify({ articles })
		}, proxyConfig);

		if (!response || !response.json) {
			throw new Error('API 返回数据格式错误');
		}

		if (response.json.media_id) {
			return response.json;
		} else {
			const errmsg = response.json.errmsg || '创建草稿失败';
			const errcode = response.json.errcode || 'unknown';
			throw new Error(`${errmsg} (errcode: ${errcode})`);
		}
	} catch (error) {
		throw error;
	}
}

/**
 * 测试代理连接并返回实际出口IP
 */
export async function testProxy(proxyConfig: ResolvedProxyConfig): Promise<{ success: boolean; latency?: number; error?: string; actualIP?: string }> {
	const startTime = Date.now();

	try {
		// 先检查实际出口IP
		const ipCheckResponse = await requestWithProxy('https://api.ipify.org?format=json', {
			url: 'https://api.ipify.org?format=json',
			method: 'GET'
		}, proxyConfig);

		const actualIP = ipCheckResponse.json?.ip || 'unknown';
		// 再测试访问微信API
		await requestWithProxy('https://api.weixin.qq.com', {
			url: 'https://api.weixin.qq.com',
			method: 'GET'
		}, proxyConfig);

		const latency = Date.now() - startTime;

		return {
			success: true,
			latency,
			actualIP
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : '代理连接失败'
		};
	}
}

/**
 * 仅检查当前代理的实际出口IP
 */
export async function checkProxyIP(proxyConfig?: ResolvedProxyConfig): Promise<string> {
	try {
		const response = await requestWithProxy('https://api.ipify.org?format=json', {
			url: 'https://api.ipify.org?format=json',
			method: 'GET'
		}, proxyConfig);

		const ip = response.json?.ip || 'unknown';
		return ip;
	} catch (error) {
		return 'unknown';
	}
}
