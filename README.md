# WeChatPB for Obsidian

Publish Markdown notes to the draft boxes of multiple WeChat Official Accounts from Obsidian.

> Desktop only: Windows, macOS, and Linux

## Features

- Manage and publish to multiple WeChat Official Accounts in one operation.
- Preview articles with 14 bundled Memoria themes or your own vault-based themes.
- Upload, compress, and reuse cover images and note images.
- Remove YAML frontmatter before publishing when desired.
- Export the formatted article as a long PNG image.
- Store AppSecret, access tokens, and proxy passwords in Obsidian SecretStorage.
- Use optional HTTP or SOCKS5 proxies and retain local publishing history.

## Installation

Download the latest [GitHub release](../../releases), then place `main.js`, `manifest.json`, and `styles.css` in:

```text
.obsidian/plugins/wechat-multi-publisher/
```

Enable **WeChatPB** in Obsidian under **Settings → Community plugins**.

## Privacy and network access

The plugin contacts the WeChat Official Account API only when you test an account, check its status, upload media, or create a draft. Proxy tests may contact `api.ipify.org`. Article content and images are not sent to servers controlled by the plugin author. Credentials are stored with Obsidian SecretStorage and are not written to `data.json`.

## 中文说明

一款 Obsidian 插件，支持将 Markdown 笔记**批量发布**到多个微信公众号草稿箱。

> 支持 Windows / macOS / Linux 桌面端

## 功能特性

- **多账号管理**：同时管理多个公众号，一键批量发布
- **Memoria 排版库**：内置 14 款优化排版，新用户无需配置文件夹
- **AI 自定义排版**：提供可一键复制给 AI 的 CSS 规范与示例
- **封面图片**：支持上传封面图片，发布时自动压缩
- **默认封面**：可在设置中保存一张默认封面
- **实时预览**：发布前可预览排版效果
- **长图导出**：将排版后的文章保存为 PNG 到当前笔记目录
- **Frontmatter 处理**：可选择剥离 YAML frontmatter
- **图片压缩上传**：自动将笔记中的图片压缩并上传到公众号素材库
- **代理支持**：支持 SOCKS5 / HTTP 代理，解决网络访问问题
- **发布历史**：记录每次发布结果，方便回溯

## 安装

### 手动安装

1. 下载最新的 [Release](../../releases)
2. 解压到你的 Obsidian vault 的 `.obsidian/plugins/wechat-multi-publisher/` 目录
3. 在 Obsidian 设置 → 第三方插件中启用「WeChatPB」

### 目录结构

```
.obsidian/plugins/wechat-multi-publisher/
├── main.js          # 插件主文件
├── styles.css       # 插件样式
├── manifest.json    # 插件元数据
└── data.json        # 运行时配置（自动生成，勿手动编辑）
```

内置主题已打包进 `main.js`，安装 Release 中的三个文件即可使用；仓库内的 `themes/` 是主题源文件。

## 配置

### 1. 添加公众号

1. 打开 Obsidian 设置 → WeChatPB
2. 点击「添加账号」
3. 填入公众号的 **AppID** 和 **AppSecret**
   - 在[微信公众平台](https://mp.weixin.qq.com/) → 设置与开发 → 基本配置中获取
   - 需要将服务器 IP 添加到公众号的 IP 白名单中
4. （可选）配置代理服务器

### 2. 排版主题

插件自带 14 款 Memoria 排版主题，默认使用「绿白清简」。新用户无需选择文件夹，也无需点击“保存并应用”。

如果你要导入或学习自己的排版，可以在设置中开启「启用自定义排版」：

1. 在 vault 中创建一个文件夹（如 `css-themes/`）
2. 在其中放入 `.css` 文件或包含 CSS 代码块的 `.md` 文件
3. 在插件设置中选择「自定义样式文件夹」

设置页的「查看 AI 排版规范」会提供完整示例，可以直接复制给 AI，再补充品牌色、参考图片或文章类型。

**CSS 文件格式：**

直接使用 `.css` 文件，或者在 `.md` 文件中用代码块包裹：

````markdown
# 我的自定义主题

```css
.note-to-mp h1 {
    color: #333;
    border-bottom: 2px solid #07C160;
}

.note-to-mp p {
    line-height: 1.8;
    color: #555;
}
```
````

## 使用方法

1. 打开侧边栏的「WeChatPB」面板
2. 打开你要发布的 Markdown 笔记
3. 选择排版样式（可选）
4. 上传封面图片（可选）
5. 勾选要发布到的公众号
6. 点击「预览」查看效果，或直接点击「发布」

文章会发布到公众号的**草稿箱**中，你可以在微信公众平台中进一步编辑和发布。

## 内置主题预览

| 主题名称 | 风格描述 |
|---------|---------|
| 绿白清简 | 绿色与白色的品牌留白，默认主题；二级标题显示 TITEL 01、02… |
| 蓝白案例 | 蓝白卡片与数据感标题；二级标题显示 TITEL 01、02… |
| 墨白极简 | 克制的黑白灰层级 |
| 赤红报刊 | 高对比赤红报刊感 |
| 酒红书刊 | 酒红色书刊气质 |
| 靛蓝书签 | 靛蓝层级书签 |
| 赤红夹线 | 红色夹线与纸面感 |
| 靛蓝浮雕 | 靛蓝卡片与轻浮雕 |
| 清墨留白 | 清淡墨色与大留白 |
| 粉紫渐隐 | 粉紫渐变与柔和分隔 |
| 青绿胶囊 | 青绿色胶囊标题 |
| 绿荧标记 | 绿色荧光重点标记 |
| 蓝荧标记 | 蓝色高亮重点标记 |
| 青紫霓虹 | 青紫暗色霓虹 |

## 注意事项

- 需要已认证的微信公众号（服务号或已认证的订阅号）
- AppSecret 请妥善保管，不要泄露
- AppSecret、Access Token 和代理密码保存在 Obsidian SecretStorage 中，不写入 `data.json`
- 发布需要将服务器/代理 IP 添加到公众号的 IP 白名单
- 图片会自动压缩上传至公众号素材库

## 隐私与网络请求

插件只在你测试账号、检测状态或发布草稿时请求微信公众平台 API；测试代理或查看出口 IP 时会请求 `api.ipify.org`。若配置代理，相应请求会经过该代理。文章正文和图片不会上传到作者控制的服务器。

## 开发

```bash
npm install
npm run build
```

构建会生成 Obsidian 运行所需的 `main.js`。提交问题前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)；安全问题请按 [SECURITY.md](SECURITY.md) 的方式报告。
