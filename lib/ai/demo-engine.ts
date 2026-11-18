import type {
  AnalysisResult,
  ColorProfile,
  DimensionScore,
  AlternativeLook,
} from './types';

/**
 * 演示模式推理引擎。
 *
 * 重要：这里不做"假装看到衣服"的事。它只依据 canvas 提取到的
 * 客观色彩特征（主色、明度、饱和度、冷暖、丰富度）进行推理，
 * 并对无法从颜色判断的维度明确标注不确定性。
 *
 * 同一个种子（file.name + size + 色彩特征）会得到稳定一致的结果。
 */
export function analyzeInDemoMode(
  profile: ColorProfile,
  seed?: string,
): AnalysisResult {
  const rand = seededRandom(`${seed || 'style'}-${profile.dominant.join('-')}-${profile.lightness}-${profile.diversity}`);
  const colors = profile.dominant;
  const c1 = colors[0] || '中性色';
  const c2 = colors[1] || colors[0] || '中性色';
  const isWarm = profile.warmth > 0.15;
  const isCool = profile.warmth < -0.15;
  const isDark = profile.lightness < 42;
  const isLight = profile.lightness > 62;
  const isMuted = profile.saturation < 28;
  const isVivid = profile.saturation > 55;
  const hasContrast = profile.darkRatio > 0.12 && profile.lightRatio > 0.12;

  const jitter = (range: number) => Math.round((rand() - 0.5) * range);

  // ---- 各维度分数：只从可观察的色彩证据推导 ----
  const colorScore = clamp(
    84 - Math.max(0, profile.diversity - 0.5) * 45 +
      (isMuted ? 4 : 0) - (isVivid ? 7 : 0) +
      (colors.length <= 3 ? 3 : -2) + jitter(8),
  );

  const harmonyScore = clamp(
    82 - (isWarm && isCool ? 8 : 0) +
      (isWarm || isCool ? 5 : 0) - Math.max(0, profile.diversity - 0.45) * 30 + jitter(7),
  );

  const styleScore = clamp(
    76 + (colors[0] ? 5 : 0) + (hasContrast ? 5 : 0) +
      (isMuted ? 4 : 0) - (profile.diversity > 0.7 ? 8 : 0) + jitter(9),
  );

  // 版型与场景适配无法从色彩判断，分数只作参考并在文案中声明局限
  const fitScore = clamp(
    72 + (hasContrast ? 8 : 0) - (isDark && profile.darkRatio > 0.6 ? 4 : 0) + jitter(8),
  );
  const occasionScore = clamp(
    75 + (isMuted ? 6 : 0) - (isVivid ? 8 : 0) - (profile.diversity > 0.65 ? 5 : 0) + jitter(7),
  );

  const dimensions: DimensionScore[] = [
    {
      key: 'color',
      label: '色彩搭配',
      score: colorScore,
      comment:
        profile.diversity > 0.6
          ? `检测到 ${colors.length} 类主要色系，颜色略多，收拢到两到三种会更耐看。`
          : isMuted
            ? '低饱和配色显得克制，色块之间的关系比较舒服。'
            : '主色与辅色的关系清晰，色彩表达有想法。',
    },
    {
      key: 'fit',
      label: '服装版型',
      score: fitScore,
      comment:
        '版型无法仅凭色彩判断，此项根据画面明暗分布粗略推测，仅供参考。',
    },
    {
      key: 'harmony',
      label: '整体协调',
      score: harmonyScore,
      comment:
        isWarm && isCool
          ? '冷暖色调同时出现，若能增加过渡色会让整体更统一。'
          : '色调倾向一致，鞋履与配饰的呼应关系较为协调。',
    },
    {
      key: 'style',
      label: '风格表达',
      score: styleScore,
      comment:
        colors[0]
          ? `以${c1}为视觉主线，风格方向可辨识。`
          : '风格线索不够集中，建议先确定一个主基调。',
    },
    {
      key: 'occasion',
      label: '场景适配',
      score: occasionScore,
      comment:
        isMuted
          ? '配色克制，日常与通勤场景都比较容易融入。'
          : '色彩较有存在感，更适合休闲或社交场合。',
    },
  ];

  const overall = clamp(
    Math.round(
      colorScore * 0.26 +
        fitScore * 0.14 +
        harmonyScore * 0.22 +
        styleScore * 0.19 +
        occasionScore * 0.19,
    ),
  );

  const verdict =
    overall >= 88
      ? '配色考究，风格完整，整体完成度很高。'
      : overall >= 80
        ? '整体协调，风格统一，细节仍有提升空间。'
        : overall >= 72
          ? '搭配思路清晰，若能再收敛配色会更显质感。'
          : overall >= 62
            ? '有不错的搭配想法，配色与层次还可以进一步梳理。'
            : '单品各有特点，建议先从统一配色与简化层次入手。';

  // ---- 优点：只陈述色彩层面能观察到的正面事实 ----
  const strengths: string[] = [];
  if (colors.length > 0 && profile.diversity < 0.62) {
    strengths.push(`${c1}作为主色贯穿画面，视觉焦点比较明确。`);
  }
  if (profile.diversity < 0.5) {
    strengths.push('颜色数量克制，没有出现多种颜色互相抢占注意力的情况。');
  }
  if (hasContrast) {
    strengths.push('明暗之间形成了层次，画面不会显得平淡。');
  }
  if (isMuted) {
    strengths.push('整体饱和度偏低，配色显得沉稳、耐看。');
  }
  if (isWarm) {
    strengths.push('暖色调带来温和的亲近感，氛围统一。');
  }
  if (strengths.length < 2) {
    strengths.push('色彩选择有个人倾向，具备继续打磨风格的基础。');
  }
  if (strengths.length < 3) {
    strengths.push('基础配色关系成立，适合在此基础上做小范围调整。');
  }

  // ---- 建议：每条都指向当前照片里观察到的具体问题 ----
  const suggestions: string[] = [];
  if (profile.diversity > 0.6) {
    suggestions.push(
      `画面中出现了 ${colors.slice(0, 3).join('、')} 等多类颜色，建议把外层或配饰收敛到一种中性色，让主色更突出。`,
    );
  }
  if (isWarm && isCool) {
    suggestions.push(
      '冷暖色同时出现且缺少过渡，可以用一件米色或灰褐色的单品衔接，让整体更连贯。',
    );
  }
  if (isVivid) {
    suggestions.push(
      '检测到较高饱和度的色块，缩小亮色面积、改用低饱和配饰会让搭配更耐看。',
    );
  }
  if (isDark && profile.darkRatio > 0.5) {
    suggestions.push(
      '深色占据了画面大部分，加入一件浅色内搭或浅色鞋履可以提亮视觉重心。',
    );
  }
  if (isLight && profile.lightRatio > 0.5) {
    suggestions.push(
      '整体偏浅，用一件深色单品压住重心，会让轮廓更利落、更有精神。',
    );
  }
  if (!hasContrast) {
    suggestions.push(
      '上下装明度比较接近，可以通过深浅对比强化纵向比例和层次。',
    );
  }
  if (isMuted && profile.diversity < 0.4) {
    suggestions.push(
      '中性色打底很稳，可以在包袋或丝巾上加入一点橄榄绿，作为小面积点缀。',
    );
  }
  if (suggestions.length < 2) {
    suggestions.push('保持现有配色逻辑，只在鞋履或包袋上做一处呼应即可提升完整度。');
  }
  if (suggestions.length < 3) {
    suggestions.push('整理好上衣下摆与外层线条，让服装的纵向线条保持连贯。');
  }

  // ---- "如果这样搭配"：把检测到的颜色落到具体单品上 ----
  const alternatives: AlternativeLook[] = [
    {
      from: `${c1}上装 + ${c2}下装 + 现有鞋履`,
      to: `${c1}上装 + ${neutralize(c2)}直筒长裤 + 简约皮鞋`,
      reason: '把下装换成垂坠感更好的中性色直筒版型，鞋履统一为简洁款式，整体线条会更利落。',
    },
    {
      from: `${c1}与${c2}的两件式组合`,
      to: `${c1}与${c2} + ${suggestOuter(c1, isWarm)}薄外套`,
      reason: '增加一层外搭制造纵向线条，并用同色系配饰呼应，能明显提升造型的完整度。',
    },
  ];

  const tone = isDark ? '沉稳深色调' : isLight ? '明亮浅色调' : '中性中间调';
  const paletteNote =
    profile.diversity > 0.6
      ? '颜色较多，缺少明确的主次关系'
      : colors.length >= 2
        ? `${c1}与${c2}形成了清晰的主辅关系`
        : `以${c1}为绝对主色，配色克制`;

  const summary =
    `从照片呈现的配色看，${c1}${colors[1] ? `与${c2}` : ''}已经建立了清晰的基调，` +
    `${strengths[0].replace(/。$/, '')}。` +
    `${isMuted ? '低饱和的选择让整体显得克制而有质感。' : '色彩表达有自己的主张。'}` +
    `接下来最值得动手的一步是：${suggestions[0].replace(/。$/, '')}。` +
    `这套搭配的方向是对的，把细节收一收，会更接近你想要的风格。`;

  return {
    id: `demo-${Date.now().toString(36)}`,
    mode: 'demo',
    createdAt: new Date().toISOString(),
    overall: { score: overall, verdict },
    dimensions,
    strengths: strengths.slice(0, 3),
    suggestions: suggestions.slice(0, 3),
    alternatives,
    summary,
    observed: {
      dominantColors: colors,
      tone,
      paletteNote,
    },
    disclaimer:
      '演示分析：以上结论基于图片的整体色彩分布（可能包含背景），并非真实 AI 视觉理解。' +
      '系统未识别具体服装款式、品牌或身材信息，评分与建议仅供参考。',
  };
}

function clamp(value: number, min = 55, max = 96): number {
  return Math.min(max, Math.max(min, value));
}

/** 把检测到的色名转换为更具体的中性下装建议。 */
function neutralize(color: string): string {
  const map: Record<string, string> = {
    黑色系: '深灰',
    白色系: '浅灰',
    灰色系: '浅灰',
    米色系: '燕麦色',
    棕色系: '深咖色',
    蓝色系: '藏蓝',
    绿色系: '橄榄绿',
    红色系: '深灰',
    粉紫色系: '浅灰',
    紫色系: '炭灰',
    黄色系: '卡其',
    橙色系: '深咖色',
    青绿色系: '墨绿',
  };
  return map[color] || '深灰';
}

function suggestOuter(color: string, isWarm: boolean): string {
  if (color === '蓝色系') return '米白色';
  if (color === '黑色系') return '浅沙色';
  if (color === '白色系') return '灰褐色';
  return isWarm ? '浅沙色' : '灰褐色';
}

/** 基于字符串生成稳定的伪随机序列，保证同一张照片结果一致。 */
function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
