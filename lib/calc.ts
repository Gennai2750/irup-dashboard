import {
  AI_DAILY_MINUTES,
  AI_LEVELS,
  DAYS_PER_MONTH,
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  LAYERS,
  LAYER_ORDER,
  RATE_STEP,
  REQUIRE_TEACH_BELOW_TARGET,
  ROLE_SKILLS,
  SKILL_LEVELS,
  SOFT_SKILLS,
  TRIED_PROGRESS,
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
  /** いつまでに達成したいか（ヶ月後） */
  deadlineMonths: number;
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
  deadlineMonths: 24,
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

/** AIキャッチアップに毎日あてる時間（時間） */
export const AI_DAILY_HOURS = AI_DAILY_MINUTES / 60;

/** 単価（万円／月）から担当レイヤーを引く */
export function layerOfRate(rate: number): LayerKey {
  for (const l of LAYERS) {
    if (rate <= l.maxRate) return l.key;
  }
  return LAYERS[LAYERS.length - 1].key;
}

export const layerByKey = (key: LayerKey) => LAYERS.find((l) => l.key === key)!;

/** その項目に、いままでに投じ終えた時間 */
export function progressHours(item: SkillItem, level: SkillLevel | undefined): number {
  switch (level) {
    case 'teach':
      return item.teachHours;
    case 'use':
      return item.useHours;
    case 'tried':
      return item.useHours * TRIED_PROGRESS;
    default:
      return 0;
  }
}

/**
 * その項目に求められる到達レベル。
 * 目標レイヤー自身の技術は「扱える」まで、それより下のレイヤーは「教えられる」まで。
 */
export function requiredLevelOf(item: SkillItem, targetLayer: LayerKey): 'use' | 'teach' {
  if (!REQUIRE_TEACH_BELOW_TARGET) return 'use';
  return LAYER_ORDER[item.layer] < LAYER_ORDER[targetLayer] ? 'teach' : 'use';
}

/** その到達レベルに必要な時間 */
export const requiredHours = (item: SkillItem, targetLayer: LayerKey): number =>
  requiredLevelOf(item, targetLayer) === 'teach' ? item.teachHours : item.useHours;

/** その項目に残っている学習時間 */
export const remainingHours = (
  item: SkillItem,
  level: SkillLevel | undefined,
  targetLayer: LayerKey,
): number => Math.max(0, requiredHours(item, targetLayer) - progressHours(item, level));

/* ------------------------------------------------------------------ */
/* 集計                                                                */
/* ------------------------------------------------------------------ */

export type GapItem = SkillItem & {
  level: SkillLevel | undefined;
  requiredLevel: 'use' | 'teach';
  required: number;
  progress: number;
  remain: number;
  /** ここまでの累積学習時間 */
  cumulative: number;
};

export type Derived = {
  currentLayer: LayerKey;
  targetLayer: LayerKey;
  rateSteps: number;
  goalNotHigher: boolean;

  requiredSkills: readonly SkillItem[];
  gapSkills: GapItem[];
  gapSoftSkills: GapItem[];

  techHours: number;
  softHours: number;
  /** 期限までにやりきる学習時間の合計（AIキャッチアップは含まない） */
  totalHours: number;
  alreadyThere: boolean;

  /** 目標レイヤーで求められるAI活用レベルと、いまとの差 */
  requiredAiLevel: number;
  aiGapSteps: number;

  monthlyFree: number;
  weekdayDaysPerMonth: number;
  holidayDaysPerMonth: number;
  /** 1日あたりの空き時間（月の空き時間を30.45日でならしたもの） */
  dailyFree: number;

  /** いつまでに達成したいか（ヶ月） */
  deadlineMonths: number;
  /** 毎日のAIキャッチアップ（時間） */
  aiDaily: number;
  /** 期限に間に合わせるために、1日あたり必要な技術学習の時間 */
  dailyStudy: number;
  /** AIキャッチアップを足した1日あたりの合計 */
  dailyTotal: number;
  /** 1日の合計が空き時間の何％か（空き時間0なら null） */
  dailyShareOfFree: number | null;
  /** 空き時間に収まるか */
  feasible: boolean;
  /** 収まらない場合、1日あたり何時間足りないか */
  overBy: number;
  /** いまの空き時間で間に合わせられる最短の期限（ヶ月）。AI分だけで埋まるなら null */
  minMonthsWithinFree: number | null;
};

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** レイヤーの浅い順 → 残り時間の短い順 */
function sortForRoadmap(a: GapItem, b: GapItem): number {
  const d = LAYER_ORDER[a.layer] - LAYER_ORDER[b.layer];
  if (d !== 0) return d;
  return a.remain - b.remain;
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
      return {
        ...i,
        level,
        requiredLevel: requiredLevelOf(i, targetLayer),
        required: requiredHours(i, targetLayer),
        progress: progressHours(i, level),
        remain: remainingHours(i, level, targetLayer),
        cumulative: 0,
      };
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

  const tech = buildGap(ROLE_SKILLS[s.role], s.skills, targetLayer);
  const soft = buildGap(SOFT_SKILLS, s.softSkills, targetLayer);
  const totalHours = tech.hours + soft.hours;

  const requiredAiLevel = layerByKey(targetLayer).aiLevel;

  const holidayDaysPerMonth = s.holidayPerWeek * WEEKS_PER_MONTH;
  const weekdayDaysPerMonth = (DAYS_PER_WEEK - s.holidayPerWeek) * WEEKS_PER_MONTH;
  const monthlyFree =
    clampHours(s.weekdayFree) * weekdayDaysPerMonth +
    clampHours(s.holidayFree) * holidayDaysPerMonth;
  const dailyFree = monthlyFree / DAYS_PER_MONTH;

  const months = Math.max(1, s.deadlineMonths);
  const dailyStudy = totalHours / (months * DAYS_PER_MONTH);
  const dailyTotal = AI_DAILY_HOURS + dailyStudy;

  // AIキャッチアップを引いた残りを学習にあてた場合、何ヶ月で終わるか
  const studyCapacity = dailyFree - AI_DAILY_HOURS;
  const minMonthsWithinFree =
    totalHours === 0 ? 0 : studyCapacity > 0 ? totalHours / (studyCapacity * DAYS_PER_MONTH) : null;

  return {
    currentLayer,
    targetLayer,
    rateSteps: Math.max(0, Math.round((s.goalRate - s.currentRate) / RATE_STEP)),
    goalNotHigher: s.goalRate <= s.currentRate,

    requiredSkills: tech.required,
    gapSkills: tech.gap,
    gapSoftSkills: soft.gap,

    techHours: tech.hours,
    softHours: soft.hours,
    totalHours,
    alreadyThere: totalHours === 0,

    requiredAiLevel,
    aiGapSteps: Math.max(0, Math.min(AI_LEVELS.length, requiredAiLevel) - s.aiLevel),

    monthlyFree,
    weekdayDaysPerMonth,
    holidayDaysPerMonth,
    dailyFree,

    deadlineMonths: months,
    aiDaily: AI_DAILY_HOURS,
    dailyStudy,
    dailyTotal,
    dailyShareOfFree: monthlyFree > 0 ? (dailyTotal / dailyFree) * 100 : null,
    feasible: dailyTotal <= dailyFree,
    overBy: Math.max(0, dailyTotal - dailyFree),
    minMonthsWithinFree,
  };
}

/* ------------------------------------------------------------------ */
/* 期限                                                                */
/* ------------------------------------------------------------------ */

/** その月数後の年月 */
export function targetDate(base: Date, months: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), 1);
  d.setMonth(d.getMonth() + Math.ceil(months));
  return d;
}

/** その期限に間に合わせるために、1日あたり必要な技術学習の時間 */
export const dailyStudyForMonths = (totalHours: number, months: number): number =>
  months > 0 ? totalHours / (months * DAYS_PER_MONTH) : Number.POSITIVE_INFINITY;

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
