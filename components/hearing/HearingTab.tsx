'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Block01Role } from './Block01Role';
import { Block02CurrentRate } from './Block02CurrentRate';
import { Block03Skills } from './Block03Skills';
import { Block04Ai } from './Block04Ai';
import { Block05SoftSkills } from './Block05SoftSkills';
import { Block06Free } from './Block06Free';
import { Block07Goal } from './Block07Goal';
import type { Derived, FormState } from '@/lib/calc';
import type { RoleKey, SkillLevel } from '@/lib/constants';

const styles = stylex.create({
  stack: { display: 'flex', flexDirection: 'column', gap: '16px' },
  footer: { display: 'flex', justifyContent: 'flex-end', marginTop: '4px' },
  cta: {
    fontFamily: fonts.sans,
    fontSize: '14px',
    fontWeight: 500,
    color: colors.accentText,
    backgroundColor: colors.accent,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.accent,
    borderRadius: shape.radiusSm,
    padding: '11px 26px',
    opacity: { default: 1, ':hover': 0.88 },
  },
});

export type Setters = {
  role: (v: RoleKey) => void;
  currentRate: (v: number) => void;
  goalRate: (v: number) => void;
  skillToggle: (name: string, checked: boolean) => void;
  skillLevel: (name: string, level: SkillLevel) => void;
  softToggle: (name: string, checked: boolean) => void;
  softLevel: (name: string, level: SkillLevel) => void;
  aiLevel: (v: number) => void;
  weekdayFree: (v: number) => void;
  holidayFree: (v: number) => void;
  holidayPerWeek: (v: number) => void;
  deadlineMonths: (v: number) => void;
  name: (v: string) => void;
};

export function HearingTab({
  state,
  derived,
  set,
  today,
  onGoResult,
}: {
  state: FormState;
  derived: Derived;
  set: Setters;
  today: Date | null;
  onGoResult: () => void;
}) {
  return (
    <div {...stylex.props(styles.stack)}>
      <Block01Role role={state.role} onRole={set.role} />
      <Block02CurrentRate currentRate={state.currentRate} onCurrentRate={set.currentRate} />
      <Block03Skills
        role={state.role}
        skills={state.skills}
        onToggle={set.skillToggle}
        onLevel={set.skillLevel}
      />
      <Block04Ai aiLevel={state.aiLevel} onAiLevel={set.aiLevel} />
      <Block05SoftSkills
        softSkills={state.softSkills}
        onToggle={set.softToggle}
        onLevel={set.softLevel}
      />
      <Block06Free
        weekdayFree={state.weekdayFree}
        onWeekdayFree={set.weekdayFree}
        holidayFree={state.holidayFree}
        onHolidayFree={set.holidayFree}
        holidayPerWeek={state.holidayPerWeek}
        onHolidayPerWeek={set.holidayPerWeek}
        weekdayDaysPerMonth={derived.weekdayDaysPerMonth}
        holidayDaysPerMonth={derived.holidayDaysPerMonth}
        monthlyFree={derived.monthlyFree}
      />
      <Block07Goal
        goalRate={state.goalRate}
        onGoalRate={set.goalRate}
        goalNotHigher={derived.goalNotHigher}
        deadlineMonths={state.deadlineMonths}
        onDeadlineMonths={set.deadlineMonths}
        today={today}
        name={state.name}
        onName={set.name}
      />
      <div {...stylex.props(styles.footer)}>
        <button type="button" {...stylex.props(styles.cta)} onClick={onGoResult}>
          結果を見る
        </button>
      </div>
    </div>
  );
}
