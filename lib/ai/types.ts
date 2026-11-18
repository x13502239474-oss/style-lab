/** 分析结果的结构化 JSON 契约：演示模式与真实 AI 模式共用同一套结构。 */

export type AnalysisMode = 'demo' | 'ai';

export type DimensionKey = 'color' | 'fit' | 'harmony' | 'style' | 'occasion';

export interface DimensionScore {
  key: DimensionKey;
  label: string;
  score: number;
  comment: string;
}

export interface AlternativeLook {
  from: string;
  to: string;
  reason: string;
}

export interface ObservedInfo {
  dominantColors: string[];
  tone: string;
  paletteNote: string;
}

export interface AnalysisResult {
  id: string;
  mode: AnalysisMode;
  createdAt: string;
  overall: {
    score: number;
    verdict: string;
  };
  dimensions: DimensionScore[];
  strengths: string[];
  suggestions: string[];
  alternatives: AlternativeLook[];
  summary: string;
  observed: ObservedInfo;
  disclaimer?: string;
}

/** 从图片中提取的客观色彩特征，是演示模式推理的依据。 */
export interface ColorProfile {
  /** 占比最高的颜色类别名，最多 4 个 */
  dominant: string[];
  /** 平均亮度 0-100 */
  lightness: number;
  /** 平均饱和度 0-100 */
  saturation: number;
  /** 暖冷倾向 -1(冷) ~ 1(暖) */
  warmth: number;
  /** 色彩丰富度 0-1，越高代表颜色越杂 */
  diversity: number;
  /** 深色区域占比 0-1 */
  darkRatio: number;
  /** 浅色区域占比 0-1 */
  lightRatio: number;
}
