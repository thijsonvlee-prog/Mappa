const MAX_DIMENSION = 1920;
const THUMBNAIL_DIMENSION = 300;
const JPEG_QUALITY = 0.85;
const THUMBNAIL_QUALITY = 0.7;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be under 10 MB';
  }
  return null;
}

function resizeToFit(
  img: HTMLImageElement | ImageBitmap,
  maxDim: number,
): HTMLCanvasElement {
  let w = img.width;
  let h = img.height;
  if (w > maxDim || h > maxDim) {
    const ratio = Math.min(maxDim / w, maxDim / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      type,
      quality,
    );
  });
}

export async function processPhoto(
  file: File,
): Promise<{ blob: Blob; thumbnailBlob: Blob; width: number; height: number }> {
  const img = await createImageBitmap(file);
  const fullCanvas = resizeToFit(img, MAX_DIMENSION);
  const thumbCanvas = resizeToFit(img, THUMBNAIL_DIMENSION);
  img.close();

  const [blob, thumbnailBlob] = await Promise.all([
    canvasToBlob(fullCanvas, 'image/jpeg', JPEG_QUALITY),
    canvasToBlob(thumbCanvas, 'image/jpeg', THUMBNAIL_QUALITY),
  ]);

  return {
    blob,
    thumbnailBlob,
    width: fullCanvas.width,
    height: fullCanvas.height,
  };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64);
  const byteNumbers = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Blob([byteNumbers], { type: mimeType });
}
