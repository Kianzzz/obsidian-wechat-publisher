export interface CompressedImage {
	data: ArrayBuffer;
	mimeType: string;
}

export async function compressImage(
	data: ArrayBuffer,
	mimeType: string,
	maxSizeKB = 500
): Promise<CompressedImage> {
	if (data.byteLength <= maxSizeKB * 1024 || !/^image\/(png|jpe?g|webp)$/i.test(mimeType)) {
		return { data, mimeType };
	}

	const blobUrl = URL.createObjectURL(new Blob([data], { type: mimeType }));
	try {
		const image = new Image();
		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error('无法读取图片'));
			image.src = blobUrl;
		});

		const scale = Math.min(1, 2048 / image.naturalWidth, 2048 / image.naturalHeight);
		const canvas = document.createElement('canvas');
		canvas.width = Math.max(1, Math.floor(image.naturalWidth * scale));
		canvas.height = Math.max(1, Math.floor(image.naturalHeight * scale));
		const context = canvas.getContext('2d');
		if (!context) throw new Error('无法创建图片压缩画布');
		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		const outputMime = mimeType === 'image/png' ? 'image/jpeg' : mimeType;
		let quality = 0.9;
		let output = await canvasToBlob(canvas, outputMime, quality);
		while (output.size > maxSizeKB * 1024 && quality > 0.2) {
			quality -= 0.1;
			output = await canvasToBlob(canvas, outputMime, quality);
		}
		return { data: await output.arrayBuffer(), mimeType: outputMime };
	} finally {
		URL.revokeObjectURL(blobUrl);
	}
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('图片压缩失败')), mimeType, quality);
	});
}
