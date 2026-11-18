import type { AnalysisResult, ColorProfile } from './types';

/**
 * 真实视觉模型适配层（预留接口）。
 *
 * 采用 OpenAI 兼容的 Chat Completions 协议，因此可直接对接
 * OpenAI / 通义千问 / GLM-4V / 硅基流动 等多数视觉模型服务。
 * 只需在 .env.local 配置：
 *   NEXT_PUBLIC_AI_MODE=ai
 *   NEXT_PUBLIC_AI_ENDPOINT=https://.../chat/completions
 *   NEXT_PUBLIC_AI_API_KEY=...
 *   NEXT_PUBLIC_AI_MODEL=...
 *
 * 静态站点会把 NEXT_PUBLIC_* 在构建时内联，注意不要在公开仓库中提交真实密钥；
 * 生产环境建议把 endpoint 指向自己的服务端代理，由代理保管密钥。
 */

export interface VisionConfig {
  endpoint: string;
  apiKey?: string;
  model?: string;
}

const SYSTEM_PROMPT = `你是一位专业的时装造型顾问。请分析用户上传的穿搭照片，并只基于照片中能明确观察到的信息给出评价。

严格规则：
1. 只描述看得见的内容：服装颜色、品类、版型、搭配关系、可见的鞋子与配饰。
2. 绝对不要臆测或评论身材、体重、身高、年龄、性别、职业、身份、品牌或价格。
3. 对无法准确判断的内容，必须在对应说明中明确写出"无法从照片判断"。
4. 语气客观、友善、有审美，不吹捧也不打击用户自信。
5. 建议必须具体可执行，能对应到照片里的实际单品，不要说空泛的理论。

请严格返回如下 JSON 结构（不要附加任何解释文字）：
{
  "overall": { "score": 0-100 的整数, "verdict": "一句话综合评价" },
  "dimensions": [
    { "key": "color", "label": "色彩搭配", "score": 整数, "comment": "一句简短解释" },
    { "key": "fit", "label": "服装版型", "score": 整数, "comment": "一句简短解释" },
    { "key": "harmony", "label": "整体协调", "score": 整数, "comment": "一句简短解释" },
    { "key": "style", "label": "风格表达", "score": 整数, "comment": "一句简短解释" },
    { "key": "occasion", "label": "场景适配", "score": 整数, "comment": "一句简短解释" }
  ],
  "strengths": ["2-3 条照片中值得肯定的具体优点"],
  "suggestions": ["2-3 条具体可执行的改进建议"],
  "alternatives": [
    { "from": "原搭配的具体描述", "to": "优化后的具体搭配", "reason": "为什么这样改" }
  ],
  "summary": "一段简短的造型师点评，客观友善",
  "observed": {
    "dominantColors": ["照片中主要的颜色"],
    "tone": "色调描述",
    "paletteNote": "配色关系说明"
  }
}`;

export async function callVisionApi(
  file: File,
  profile: ColorProfile,
  config: VisionConfig,
): Promise<AnalysisResult> {
  const dataUrl = await fileToDataUrl(file);

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                '请分析这张全身穿搭照片。辅助色彩统计（来自本地图片分析，仅供参考）：' +
                JSON.stringify({
                  dominantColors: profile.dominant,
                  tone: profile.lightness > 62 ? '偏明亮' : profile.lightness < 42 ? '偏深色' : '中间调',
                  saturation: profile.saturation,
                }),
            },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI 接口返回 ${response.status}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('AI 接口返回格式异常');
  }

  const parsed = JSON.parse(stripJsonFence(content));
  return normalizeResult(parsed, profile);
}

/** 校验并补全模型返回的结果，保证前端渲染不会因缺字段而崩溃。 */
function normalizeResult(
  raw: Record<string, unknown>,
  profile: ColorProfile,
): AnalysisResult {
  const dimKeys = ['color', 'fit', 'harmony', 'style', 'occasion'] as const;
  const labels: Record<string, string> = {
    color: '色彩搭配',
    fit: '服装版型',
    harmony: '整体协调',
    style: '风格表达',
    occasion: '场景适配',
  };
  const rawDims = Array.isArray(raw.dimensions) ? (raw.dimensions as Record<string, unknown>[]) : [];

  const dimensions = dimKeys.map((key) => {
    const found = rawDims.find((d) => d?.key === key);
    return {
      key,
      label: labels[key],
      score: clampScore(Number(found?.score) || 75),
      comment: typeof found?.comment === 'string' ? found.comment : '暂无法从照片准确判断。',
    };
  });

  const overallRaw = (raw.overall || {}) as Record<string, unknown>;
  const score = clampScore(Number(overallRaw.score) || 75);

  return {
    id: `ai-${Date.now().toString(36)}`,
    mode: 'ai',
    createdAt: new Date().toISOString(),
    overall: {
      score,
      verdict:
        typeof overallRaw.verdict === 'string'
          ? overallRaw.verdict
          : '整体搭配已完成基础表达，仍可继续打磨细节。',
    },
    dimensions,
    strengths: toStringArray(raw.strengths, 2),
    suggestions: toStringArray(raw.suggestions, 2),
    alternatives: Array.isArray(raw.alternatives)
      ? (raw.alternatives as Record<string, unknown>[])
          .filter((a) => a && typeof a.from === 'string' && typeof a.to === 'string')
          .slice(0, 3)
          .map((a) => ({
            from: a.from as string,
            to: a.to as string,
            reason: typeof a.reason === 'string' ? a.reason : '',
          }))
      : [],
    summary:
      typeof raw.summary === 'string'
        ? raw.summary
        : '这套搭配有清晰的表达，继续在细节上做统一会更完整。',
    observed: {
      dominantColors: toStringArray(
        (raw.observed as Record<string, unknown>)?.dominantColors,
        1,
        profile.dominant,
      ).slice(0, 4),
      tone:
        typeof (raw.observed as Record<string, unknown>)?.tone === 'string'
          ? ((raw.observed as Record<string, unknown>).tone as string)
          : '中性色调',
      paletteNote:
        typeof (raw.observed as Record<string, unknown>)?.paletteNote === 'string'
          ? ((raw.observed as Record<string, unknown>).paletteNote as string)
          : '配色关系较清晰。',
    },
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

function stripJsonFence(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function toStringArray(value: unknown, min: number, fallback: string[] = []): string[] {
  const arr = Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
  if (arr.length >= min) return arr;
  return [...arr, ...fallback].slice(0, Math.max(min, 3));
}
