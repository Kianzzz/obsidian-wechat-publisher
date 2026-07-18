import appleMinimal from '../themes/Apple极简-黑.md';
import nikkeiRed from '../themes/Nikkei-红.md';
import bookCenter from '../themes/书刊居中-酒红.md';
import bookmarkBlue from '../themes/层级书签-蓝.md';
import newspaperRed from '../themes/报刊夹线-红.md';
import goldBlueLine from '../themes/流光底线-金蓝.md';
import embossedIndigo from '../themes/浮雕卡片-靛蓝.md';
import clearMinimal from '../themes/清水极简-黑.md';
import fadedLine from '../themes/渐隐底线-粉紫.md';
import capsuleGreen from '../themes/胶囊药丸-绿.md';
import markerGreen from '../themes/荧光马克-绿.md';
import markerBlue from '../themes/荧光马克-蓝.md';
import neonDark from '../themes/霓虹暗底-青紫.md';

export const BUILTIN_THEME_DOCUMENTS: ReadonlyArray<{ name: string; content: string }> = [
	{ name: 'Apple极简-黑', content: appleMinimal },
	{ name: 'Nikkei-红', content: nikkeiRed },
	{ name: '书刊居中-酒红', content: bookCenter },
	{ name: '层级书签-蓝', content: bookmarkBlue },
	{ name: '报刊夹线-红', content: newspaperRed },
	{ name: '流光底线-金蓝', content: goldBlueLine },
	{ name: '浮雕卡片-靛蓝', content: embossedIndigo },
	{ name: '清水极简-黑', content: clearMinimal },
	{ name: '渐隐底线-粉紫', content: fadedLine },
	{ name: '胶囊药丸-绿', content: capsuleGreen },
	{ name: '荧光马克-绿', content: markerGreen },
	{ name: '荧光马克-蓝', content: markerBlue },
	{ name: '霓虹暗底-青紫', content: neonDark }
];
