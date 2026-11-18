import { extractColorProfile } from './image';
import { analyzeInDemoMode } from './demo-engine';
import { callVisionApi } from './vision-api';
import type { AnalysisResult } from './types';

/**
 * 分析入口：业务代码只依赖这一个函数。
 * 通过环境变量在"真实 AI"与"演示模式"之间切换，调用方无需改动。
 */
export async function analyzeOutfit(file: File): Promise<AnalysisResult> {
  const profile = await extractColorProfile(file);
  const seed = `${file.name}-${file.size}`;

  if (isRealAiEnabled()) {
    try {
      return await callVisionApi(file, profile, {
        endpoint: process.env.NEXT_PUBLIC_AI_ENDPOINT as string,
        apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
        model: process.env.NEXT_PUBLIC_AI_MODEL,
      });
    } catch (error) {
      // 接口不可用时自动降级，并如实告知用户，绝不伪装成真实 AI 结果
      const fallback = analyzeInDemoMode(profile, seed);
      const reason = error instanceof Error ? error.message : '未知错误';
      fallback.disclaimer =
        `真实 AI 接口调用失败（${reason}），已自动切换为演示分析。` +
        (fallback.disclaimer || '');
      return fallback;
    }
  }

  return analyzeInDemoMode(profile, seed);
}

export function isRealAiEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_AI_MODE === 'ai' &&
    Boolean(process.env.NEXT_PUBLIC_AI_ENDPOINT)
  );
}
