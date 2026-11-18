import type { ColorProfile } from './types';

/**
 * 用 canvas 对图片做降采样色彩分析，得到客观的配色特征。
 * 这是演示模式的推理依据 —— 分析结果会随上传照片的真实色彩而变化。
 */
export async function extractColorProfile(file: File): Promise<ColorProfile> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const size = 72;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('浏览器不支持 canvas 读取');

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        URL.revokeObjectURL(objectUrl);
        resolve(analyzePixels(data));
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('图片解析失败，请更换图片重试'));
    };

    img.src = objectUrl;
  });
}

function analyzePixels(data: Uint8ClampedArray): ColorProfile {
  const buckets: Record<string, number> = {};
  let lightSum = 0;
  let satSum = 0;
  let warmthSum = 0;
  let warmthWeight = 0;
  let darkCount = 0;
  let lightCount = 0;
  let validCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue;

    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const l = (max + min) / 2;

    let s = 0;
    let h = 0;
    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r:
          h = ((g - b) / delta) % 6;
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        default:
          h = (r - g) / delta + 4;
      }
      h *= 60;
      if (h < 0) h += 360;
    }

    const name = classifyColor(h, s, l);
    buckets[name] = (buckets[name] || 0) + 1;

    lightSum += l * 100;
    satSum += s * 100;
    if (l < 0.28) darkCount += 1;
    if (l > 0.78) lightCount += 1;

    // 色相环上 0°(红) 附近最暖，180°(青) 附近最冷
    let warmth = 0;
    if (s > 0.12) {
      warmth = Math.cos(((h - 30) * Math.PI) / 180);
      warmthSum += warmth * s;
      warmthWeight += s;
    }

    validCount += 1;
  }

  if (validCount === 0) {
    return {
      dominant: ['灰色系'],
      lightness: 50,
      saturation: 10,
      warmth: 0,
      diversity: 0,
      darkRatio: 0,
      lightRatio: 0,
    };
  }

  const entries = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  // 香农熵归一化：近似"视觉上有效的颜色数量"
  let entropy = 0;
  for (const [, count] of entries) {
    const p = count / total;
    entropy -= p * Math.log(p);
  }
  const effectiveColors = Math.exp(entropy);
  const diversity = Math.min(1, Math.max(0, (effectiveColors - 1) / 4));

  return {
    dominant: entries.slice(0, 4).map(([name]) => name),
    lightness: Math.round(lightSum / validCount),
    saturation: Math.round(satSum / validCount),
    warmth: warmthWeight > 0 ? warmthSum / warmthWeight : 0,
    diversity: Number(diversity.toFixed(3)),
    darkRatio: Number((darkCount / validCount).toFixed(3)),
    lightRatio: Number((lightCount / validCount).toFixed(3)),
  };
}

/** 把连续色彩空间映射为服装语境里可解释的色名。 */
function classifyColor(h: number, s: number, l: number): string {
  const light = l * 100;
  const sat = s * 100;

  if (light < 16) return '黑色系';
  if (light > 91 && sat < 16) return '白色系';
  if (sat < 12) return '灰色系';

  if (h >= 15 && h < 50) {
    if (light >= 62 && sat < 48) return '米色系';
    if (light < 52) return '棕色系';
    return '橙色系';
  }
  if (h >= 50 && h < 72) return '黄色系';
  if (h >= 72 && h < 165) return '绿色系';
  if (h >= 165 && h < 200) return '青绿色系';
  if (h >= 200 && h < 255) return '蓝色系';
  if (h >= 255 && h < 292) return '紫色系';
  if (h >= 292 && h < 345) return '粉紫色系';
  return '红色系';
}
