import { assetPath } from '@/lib/utils';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Look {
  id: string;
  name: string;
  scene: string;
  image: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  palette: string;
  colors: string[];
}

export interface SeasonData {
  key: Season;
  nameEn: string;
  nameZh: string;
  cover: string;
  tagline: string;
  description: string;
  looks: Look[];
}

/** 案例图使用精选时尚摄影链接；加载失败时组件会回退到对应季节的本地封面图。 */
const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=82`;

export const seasons: SeasonData[] = [
  {
    key: 'spring',
    nameEn: 'SPRING',
    nameZh: '春季',
    cover: assetPath('/images/season-spring.jpg'),
    tagline: '万物生长，轻盈起步',
    description:
      '春季穿搭的关键在于"层次"与"透气感"。用轻薄外套承接冬日厚重，以浅色与柔和色相唤醒整体，避免一次性堆砌过多单品。',
    looks: [
      {
        id: 'sp-01',
        name: '日系清爽休闲',
        scene: '周末出行 / 咖啡馆 / 逛街',
        image: u('photo-1490481651871-ab68de25d43d'),
        top: '米白色宽松棉质衬衫，袖口微卷',
        bottom: '浅卡其直筒休闲裤，九分长度露脚踝',
        shoes: '白色低帮帆布鞋',
        accessories: '帆布托特包、细金属项链',
        palette: '米白 + 浅卡其 + 少量白，低饱和浅色系叠穿，干净透气。',
        colors: ['#EDE7DA', '#C9BBA0', '#F7F5F0'],
      },
      {
        id: 'sp-02',
        name: '简约通勤',
        scene: '办公室 / 商务会面 / 日常通勤',
        image: u('photo-1487222477894-8943e31ef7b2'),
        top: '浅蓝色修身衬衫，扎进下装',
        bottom: '深灰色西装直筒长裤',
        shoes: '黑色简约乐福鞋',
        accessories: '棕色皮质公文包、极简腕表',
        palette: '浅蓝 + 深灰 + 黑，冷暖平衡，克制而专业。',
        colors: ['#A9C0D6', '#4A4A4A', '#252525'],
      },
      {
        id: 'sp-03',
        name: '韩系层次穿搭',
        scene: '约会 / 看展 / 城市漫步',
        image: u('photo-1469334031218-e382a71b716b'),
        top: '白色圆领T恤，外搭灰褐色针织开衫',
        bottom: '深蓝色直筒牛仔裤',
        shoes: '米白色复古运动鞋',
        accessories: '帆布单肩包、金属细框眼镜',
        palette: '白 + 灰褐 + 深蓝，中性色打底，层次靠材质区分。',
        colors: ['#F7F5F0', '#8C8478', '#3A4A63'],
      },
      {
        id: 'sp-04',
        name: '轻熟风',
        scene: '晚间聚餐 / 半正式场合',
        image: u('photo-1509631179647-0177331693ae'),
        top: '燕麦色针织polo衫，质地细腻',
        bottom: '墨绿色阔腿西装裤',
        shoes: '棕色尖头低跟鞋',
        accessories: '金色耳饰、深棕色手袋',
        palette: '燕麦 + 墨绿 + 棕，低饱和撞色，成熟但不清冷。',
        colors: ['#D8CBB4', '#3D4F43', '#6B4B35'],
      },
    ],
  },
  {
    key: 'summer',
    nameEn: 'SUMMER',
    nameZh: '夏季',
    cover: assetPath('/images/season-summer.jpg'),
    tagline: '少即是多，清爽有度',
    description:
      '夏季穿搭的重点是面料与留白。减少颜色数量，让剪裁和质感说话；适当露肤但保持分寸，用一件单品建立记忆点即可。',
    looks: [
      {
        id: 'su-01',
        name: '极简清爽',
        scene: '通勤 / 日常 / 高温天气',
        image: u('photo-1483985988355-763728e1935b'),
        top: '白色亚麻宽松衬衫，透气垂坠',
        bottom: '浅灰色锥形长裤',
        shoes: '米白色皮质凉鞋',
        accessories: '草编托特包、细链条项链',
        palette: '白 + 浅灰 + 米白，全浅色系，靠面料肌理制造层次。',
        colors: ['#FFFFFF', '#D9D9D6', '#EFE8D8'],
      },
      {
        id: 'su-02',
        name: '休闲短袖搭配',
        scene: '周末 / 户外 / 旅行',
        image: u('photo-1503342217505-b0a15ec3261c'),
        top: '橄榄绿纯色棉质短袖T恤',
        bottom: '卡其色工装短裤，长度及膝上',
        shoes: '白色复古跑鞋',
        accessories: '帆布斜挎包、棒球帽',
        palette: '橄榄绿 + 卡其 + 白，自然色系，轻快不张扬。',
        colors: ['#89917B', '#BFAE8E', '#FFFFFF'],
      },
      {
        id: 'su-03',
        name: '衬衫与长裤',
        scene: '办公室 / 约会 / 看展',
        image: u('photo-1479064555552-3ef4979f8908'),
        top: '浅沙色条纹棉麻衬衫',
        bottom: '深藏蓝垂感长裤',
        shoes: '棕色皮带凉鞋',
        accessories: '皮质腕表、细框墨镜',
        palette: '浅沙 + 藏蓝 + 棕，冷暖对冲，利落且有质感。',
        colors: ['#E9E3D9', '#2C3A52', '#7A5638'],
      },
      {
        id: 'su-04',
        name: '城市度假风',
        scene: '度假 / 海边 / 周末出游',
        image: u('photo-1495121605193-b116b5b9c5fe'),
        top: '白色方领短袖上衣',
        bottom: '高腰阔腿亚麻长裤',
        shoes: '草编平底鞋',
        accessories: '宽檐草帽、木质耳环、藤编包',
        palette: '白 + 亚麻米 + 草编棕，明亮轻盈，度假氛围自然。',
        colors: ['#FFFFFF', '#E4DAC5', '#B99B72'],
      },
    ],
  },
  {
    key: 'autumn',
    nameEn: 'AUTUMN',
    nameZh: '秋季',
    cover: assetPath('/images/season-autumn.jpg'),
    tagline: '层层叠叠，温度与风度',
    description:
      '秋天最适合玩叠穿。用不同长度和材质的单品制造纵深，颜色上向大地色、酒红、墨绿靠拢，让整体更有季节的厚重感。',
    looks: [
      {
        id: 'au-01',
        name: '美式复古',
        scene: '日常 / 校园 / 周末',
        image: u('photo-1516257984-b1b4d707412e'),
        top: '酒红色棒球夹克，内搭白色T恤',
        bottom: '直筒中蓝牛仔裤',
        shoes: '棕色麂皮运动鞋',
        accessories: '帆布邮差包、金属项链',
        palette: '酒红 + 白 + 牛仔蓝 + 棕，复古感来自低饱和撞色。',
        colors: ['#7B3038', '#FFFFFF', '#4F6580'],
      },
      {
        id: 'au-02',
        name: '简约叠穿',
        scene: '通勤 / 会议 / 日常',
        image: u('photo-1529139574466-a303027c1d8b'),
        top: '白色衬衫 + 深灰圆领针织背心',
        bottom: '深咖色直筒西裤',
        shoes: '黑色德比鞋',
        accessories: '深棕皮质托特包、极简腕表',
        palette: '白 + 深灰 + 深咖，三色叠穿，层次靠材质与长度拉开。',
        colors: ['#FFFFFF', '#4A4A48', '#5A4436'],
      },
      {
        id: 'au-03',
        name: '风衣通勤',
        scene: '办公室 / 商务出行 / 雨天',
        image: u('photo-1591047139829-d91aecb6caea'),
        top: '驼色长款风衣，内搭黑色高领针织衫',
        bottom: '黑色直筒阔腿裤',
        shoes: '黑色尖头短靴',
        accessories: '深色皮质手提包、丝巾',
        palette: '驼色 + 黑，经典对比，风衣的暖色中和黑色的冷感。',
        colors: ['#C19A6B', '#252525'],
      },
      {
        id: 'au-04',
        name: '日系工装',
        scene: '户外 / 旅行 / 休闲',
        image: u('photo-1551232864-3f0890e580d9'),
        top: '军绿色工装外套，内搭白色打底',
        bottom: '卡其色束脚工装裤',
        shoes: '米白色厚底运动鞋',
        accessories: '帆布腰包、渔夫帽',
        palette: '军绿 + 卡其 + 白，同色系大地色，随性但有秩序。',
        colors: ['#6E7A5E', '#C3B08D', '#F7F5F0'],
      },
    ],
  },
  {
    key: 'winter',
    nameEn: 'WINTER',
    nameZh: '冬季',
    cover: assetPath('/images/season-winter.jpg'),
    tagline: '温暖包裹，轮廓先行',
    description:
      '冬季穿搭先看廓形，再看颜色。外套决定整体轮廓，内搭负责层次与色彩。用深色压住重心，用一小处浅色或金属色点亮。',
    looks: [
      {
        id: 'wi-01',
        name: '长款大衣',
        scene: '通勤 / 正式场合 / 城市漫步',
        image: u('photo-1544022613-e87ca75a784a'),
        top: '深灰色羊毛长款大衣，内搭黑色高领毛衣',
        bottom: '黑色直筒长裤',
        shoes: '黑色皮质长靴',
        accessories: '灰褐色围巾、皮质手套',
        palette: '深灰 + 黑 + 灰褐，同色系深浅递进，沉稳高级。',
        colors: ['#4A4A4C', '#252525', '#8C8478'],
      },
      {
        id: 'wi-02',
        name: '羽绒服简约搭配',
        scene: '日常 / 严寒天气 / 出行',
        image: u('photo-1611716435046-3e8c6f1d0f48'),
        top: '黑色短款羽绒服，内搭米白色卫衣',
        bottom: '深蓝色直筒牛仔裤',
        shoes: '白色高帮运动鞋',
        accessories: '针织帽、深色双肩包',
        palette: '黑 + 米白 + 深蓝，用内层浅色打破深色外套的沉闷。',
        colors: ['#252525', '#EDE7DA', '#2E3C56'],
      },
      {
        id: 'wi-03',
        name: '羊毛外套',
        scene: '约会 / 看展 / 周末',
        image: u('photo-1539533018447-63fcce2678e3'),
        top: '驼色双面羊毛外套，内搭浅灰色针织衫',
        bottom: '深咖色灯芯绒长裤',
        shoes: '棕色切尔西靴',
        accessories: '金属细链包、羊毛围巾',
        palette: '驼色 + 浅灰 + 深咖，暖色主导，层次柔和有温度。',
        colors: ['#C19A6B', '#C8C4BC', '#5A4436'],
      },
      {
        id: 'wi-04',
        name: '深色层次穿搭',
        scene: '晚间活动 / 都市通勤',
        image: u('photo-1548883354-94bcfe321cbb'),
        top: '墨绿色毛呢外套，内搭黑色衬衫',
        bottom: '炭灰色羊毛西裤',
        shoes: '黑色德比鞋',
        accessories: '深棕皮质手袋、低饱和橄榄绿围巾',
        palette: '墨绿 + 黑 + 炭灰，深色层次靠材质反光区分，围巾呼应外套。',
        colors: ['#2F4034', '#252525', '#3D3D3D'],
      },
    ],
  },
];

export const seasonByKey = (key: string): SeasonData | undefined =>
  seasons.find((s) => s.key === key);
