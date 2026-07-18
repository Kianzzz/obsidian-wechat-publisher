# Contributing

## Bug reports

Include the Obsidian version, plugin version, operating system, reproduction steps, and the relevant error message. Remove account credentials, tokens, proxy credentials, and private article content before posting logs.

For plugin conflicts, list the other plugin and its version, then test with only the two affected plugins enabled when possible.

## Development

1. Run `npm install`.
2. Run `npm run build`.
3. Copy `main.js`, `manifest.json`, and `styles.css` into a test vault under `.obsidian/plugins/wechat-multi-publisher/`.
4. Reload Obsidian and test account migration, preview, copy, image upload, draft creation, and unload/reload.

Do not commit `data.json`, credentials, generated backups, or `node_modules`.
