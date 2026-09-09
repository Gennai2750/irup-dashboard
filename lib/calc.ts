import {
  AI_HOURS_PER_STEP,
  AI_LEVELS,
  DAYS_PER_MONTH,
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  LAYERS,
  LAYER_ORDER,
  RATE_STEP,
  ROLE_SKILLS,
  SKILL_LEVELS,
  SOFT_SKILLS,
  UNCHECKED_REMAIN,
  WEEKS_PER_MONTH,
  type LayerKey,
  type RoleKey,
  type SkillItem,
  type SkillLevel,
} from './constants';

export type FormState = {
  role: RoleKey;
  /** 現在の単価（万円／月） */
  currentRate: number;
  /** 目標の単価（万円／月） */
  goalRate: number;
  /** 技術項目：チェックしたものだけ理解度を持つ */
  skills: Record<string, SkillLevel>;
  /** 技術以外の能力：チェックしたものだけ理解度を持つ */
  softSkills: Record<string, SkillLevel>;
  /** AI活用の現在地（1〜5） */
  aiLevel: number;
  /** 平日1日の空き時間 */
  weekdayFree: number;
  /** 休日1日の空き時間 */
  holidayFree: number;
  /** 週の休日数 */
  holidayPerWeek: number;
  /** 1日あたり学習に使う時間 */
  dailyStudy: number;
  name: string;
};

export const initialState: FormState = {
  role: 'infraCloud',
  currentRate: 60,
  goalRate: 80,
  skills: {},
  softSkills: {},
  aiLevel: 3,
  weekdayFree: 3,
  holidayFree: 6,
  holidayPerWeek: 2,
  dailyStudy: 1,
  name: '',
};

/* ------------------------------------------------------------------ */
/* 小さな純関数                                                        */
/* ------------------------------------------------------------------ */

/** 壊れた値は0にし、0〜24に収める */
export const clampHours = (raw: number): number => {
  if (!Number.isFinite(raw)) return 0;
  return Math.min(HOURS_PER_DAY, Math.max(0, raw));
};

/** 単価（万円／月）から担当レイヤーを引く */
export function layerOfRate(rate: number): LayerKey {
  for (const l of LAYERS) {
    if (rate <= l.maxRate) return l.key;
  }
  return LAYERS[LAYERS.length - 1].key;
}

export const layerByKey = (key: LayerKey) => LAYERS.find((l) => l.key === key)!;

/** 理解度に応じて「残っている学習時間の割合」を返す */
export function remainRatio(level: SkillLevel | undefined): number {
  if (level === undefined) return UNCHECKED_REMAIN;
  return SKILL_LEVELS.find((l) => l.value === level)?.remain ?? UNCHECKED_REMAIN;
}

/** その項目に残っている学習時間 */
export const remainingHours = (item: SkillItem, level: SkillLevel | undefined): number =>
  item.hours * remainRatio(level);

/* ------------------------------------------------------------------ */
/* 集計                                                                */
/* ------------------------------------------------------------------ */

export type GapItem = SkillItem & {
  /** いまの理解度（未チェックなら undefined） */
  level: SkillLevel | undefined;
  /** 残っている学習時間 */
  remain: number;
  /** ここまでの累積学習時間 */
  cumulative: number;
};

export type Derived = {
  currentLayer: LayerKey;
  targetLayer: LayerKey;
  /** 単価を何段（5万円刻み）上げようとしているか */
  rateSteps: number;
  /** 目標が現在と同じか下回っている */
  goalNotHigher: boolean;

  /** 目標レイヤーで求められる技術項目 */
  requiredSkills: readonly SkillItem[];
  /** そのうち学習時間が残っているもの（学習の順路） */
  gapSkills: GapItem[];
  /** 技術以外の能力の不足分 */
  gapSoftSkills: GapItem[];

  techHours: number;
  softHours: number;
  /** AI活用を目標レイヤーの水準まで上げるための時間 */
  aiHours: number;
  aiGapSteps: number;
  /** 目標レイヤーで求められるAI活用レベル */
  requiredAiLevel: number;
  totalHours: number;

  /** 月の空き時間 */
  monthlyFree: number;
  /** 月の学習時間（1日あたり × 30.45日） */
  monthlyStudy: number;
  /** 学習時間が空き時間の何％か（空き時間0なら null） */
  studyShareOfFree: number | null;
  /** 学習時間が空き時間を超えている */
  overCapacity: boolean;
  weekdayDaysPerMonth: number;
  holidayDaysPerMonth: number;

  /** 到達までの月数（学習時間0なら null。不足0なら0） */
  months: number | null;
  /** すでに条件を満たしている */
  alreadyThere: boolean;
};

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** レイヤーの浅い順 → 学習時間の短い順。学ぶ順路として自然な並びにする */
function sortForRoadmap(a: GapItem, b: GapItem): number {
  const d = LAYER_ORDER[a.layer] - LAYER_ORDER[b.layer];
  if (d !== 0) return d;
  return a.hours - b.hours;
}

function buildGap(
  items: readonly SkillItem[],
  held: Record<string, SkillLevel>,
  targetLayer: LayerKey,
): { required: readonly SkillItem[]; gap: GapItem[]; hours: number } {
  const required = items.filter((i) => LAYER_ORDER[i.layer] <= LAYER_ORDER[targetLayer]);
  const gap = required
    .map((i) => {
      const level = held[i.name];
      return { ...i, level, remain: remainingHours(i, level), cumulative: 0 };
    })
    .filter((g) => g.remain > 0)
    .sort(sortForRoadmap);

  let acc = 0;
  for (const g of gap) {
    acc += g.remain;
    g.cumulative = acc;
  }
  return { required, gap, hours: acc };
}

export function derive(s: FormState): Derived {
  const currentLayer = layerOfRate(s.currentRate);
  const targetLayer = layerOfRate(s.goalRate);
  const goalNotHigher = s.goalRate <= s.currentRate;

  const tech = buildGap(ROLE_SKILLS[s.role], s.skills, targetLayer);
  const soft = buildGap(SOFT_SKILLS, s.softSkills, targetLayer);

  const requiredAiLevel = layerByKey(targetLayer).aiLevel;
  const aiGapSteps = Math.max(0, Math.min(AI_LEVELS.length, requiredAiLevel) - s.aiLevel);
  const aiHours = aiGapSteps * AI_HOURS_PER_STEP;

  const totalHours = tech.hours + soft.hours + aiHours;

  const holidayDaysPerMonth = s.holidayPerWeek * WEEKS_PER_MONTH;
  const weekdayDaysPerMonth = (DAYS_PER_WEEK - s.holidayPerWeek) * WEEKS_PER_MONTH;
  const monthlyFree =
    clampHours(s.weekdayFree) * weekdayDaysPerMonth +
    clampHours(s.holidayFree) * holidayDaysPerMonth;
  const monthlyStudy = clampHours(s.dailyStudy) * DAYS_PER_MONTH;

  return {
    currentLayer,
    targetLayer,
    rateSteps: Math.max(0, Math.round((s.goalRate - s.currentRate) / RATE_STEP)),
    goalNotHigher,

    requiredSkills: tech.required,
    gapSkills: tech.gap,
    gapSoftSkills: soft.gap,

    techHours: tech.hours,
    softHours: soft.hours,
    aiHours,
    aiGapSteps,
    requiredAiLevel,
    totalHours,

    monthlyFree,
    monthlyStudy,
    studyShareOfFree: monthlyFree > 0 ? (monthlyStudy / monthlyFree) * 100 : null,
    overCapacity: monthlyStudy > monthlyFree,
    weekdayDaysPerMonth,
    holidayDaysPerMonth,

    months: monthlyStudy > 0 ? totalHours / monthlyStudy : null,
    alreadyThere: totalHours === 0,
  };
}

/* ------------------------------------------------------------------ */
/* 到達時期                                                            */
/* ------------------------------------------------------------------ */

/** その月数で到達する年月。月数は繰り上げて数える */
export function arrivalDate(base: Date, months: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), 1);
  d.setMonth(d.getMonth() + Math.ceil(months));
  return d;
}

/** 1日あたり◯時間で学んだ場合の月数（学習時間0なら null） */
export const monthsAtDailyStudy = (totalHours: number, dailyStudy: number): number | null =>
  dailyStudy > 0 ? totalHours / (dailyStudy * DAYS_PER_MONTH) : null;

/** その時間が月の空き時間の何％か（空き時間0なら null） */
export const shareOfFree = (hours: number, monthlyFree: number): number | null =>
  monthlyFree > 0 ? (hours / monthlyFree) * 100 : null;

/** チェック済み項目を理解度ごとにまとめる */
export function groupSkills(held: Record<string, SkillLevel>) {
  return SKILL_LEVELS.map((lv) => ({
    ...lv,
    items: Object.keys(held).filter((name) => held[name] === lv.value),
  }));
}
