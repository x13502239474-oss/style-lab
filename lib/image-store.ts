const STORAGE_KEY = 'style-lab:photo';

/** 压缩到最长边 1600px 的 JPEG，避免 sessionStorage 容量超限。 */
export async function compressImage(file: File): Promise<File> {
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);
  const ratio = Math.min(1, 1600 / Math.max(img.width, img.height));
  const width = Math.round(img.width * ratio);
  const height = Math.round(img.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('图片压缩失败'))),
      'image/jpeg',
      0.82,
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'outfit';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}

export async function savePhoto(file: File): Promise<File> {
  const compressed = await compressImage(file);
  try {
    sessionStorage.setItem(STORAGE_KEY, await readAsDataURL(compressed));
  } catch {
    // 隐私模式下 sessionStorage 可能不可写，不影响当前流程
  }
  return compressed;
}

export function loadPhoto(): File | null {
  if (typeof window === 'undefined') return null;
  const dataUrl = sessionStorage.getItem(STORAGE_KEY);
  if (!dataUrl) return null;

  const [header, base64] = dataUrl.split(',');
  if (!header || !base64) return null;
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], 'outfit.jpg', { type: mime });
  } catch {
    return null;
  }
}

export function clearPhoto(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
}
