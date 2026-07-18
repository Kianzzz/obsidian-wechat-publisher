# Security policy

## Supported version

Only the latest release is supported with security fixes.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting for this repository. Do not include AppSecret, access tokens, proxy passwords, unpublished article content, or other private data in a public issue.

The plugin stores AppSecret, access tokens, and proxy passwords through Obsidian SecretStorage. Publishing requests are sent to the WeChat Official Account API, directly or through the proxy explicitly configured by the user. Proxy tests also contact `api.ipify.org` to report the exit IP.
