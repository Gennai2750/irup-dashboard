'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { ChoiceButtons } from '@/components/ui/ChoiceButtons';
import { DEADLINE_OPTIONS, RATE_OPTIONS } from '@/lib/constants';
import { ym } from '@/lib/format';
import { targetDate } from '@/lib/calc';
import { RateNote } from './RateNote';

const styles = stylex.create({
  q: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, marginBottom: '10px' },
  block: { marginTop: '22px' },
  warn: {
    fontFamily: fonts.sans,
    fontSize: '12.5px',
    color: colors.accent,
    marginTop: '10px',
    padding: '9px 11px',
    backgroundColor: colors.accentWeak,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.accentBorder,
    borderRadius: shape.radiusSm,
  },
  when: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginTop: '12px',
    padding: '12px 14px',
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
  },
  whenLabel: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted },
  whenValue: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '20px',
    fontWeight: 700,
    color: colors.accent,
  },
  nameRow: { display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px' },
  input: {
    fontFamily: fonts.sans,
    fontSize: '14px',
    color: colors.text,
    backgroundColor: colors.cardBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape.radiusSm,
    padding: '8px 10px',
    outline: 'none',
    borderColor: { default: colors.border, ':focus': colors.accent },
  },
  hint: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint },
});

export function Block07Goal({
  goalRate,
  onGoalRate,
  goalNotHigher,
  deadlineMonths,
  onDeadlineMonths,
  today,
  name,
  onName,
}: {
  goalRate: number;
  onGoalRate: (v: number) => void;
  goalNotHigher: boolean;
  deadlineMonths: number;
  onDeadlineMonths: (v: number) => void;
  today: Date | null;
  name: string;
  onName: (v: string) => void;
}) {
  const due = today ? targetDate(today, deadlineMonths) : null;
  return (
    <Card no="07" title="目標">
      <p {...stylex.props(styles.q)}>単価を幾らまで上げたいですか（5万円刻み）</p>
      <ChoiceButtons
        name="目標の単価"
        options={RATE_OPTIONS.map((v) => ({ value: v, label: `${v}万` }))}
        value={goalRate}
        onChange={onGoalRate}
      />
      <RateNote rate={goalRate} label="そこは" />
      {goalNotHigher ? (
        <p {...stylex.props(styles.warn)}>
          目標が現在の単価と同じか、それより低くなっています。上の単価を選んでください。
        </p>
      ) : null}

      <div {...stylex.props(styles.block)}>
        <p {...stylex.props(styles.q)}>いつまでに達成したいですか</p>
        <ChoiceButtons
          name="期限"
          options={DEADLINE_OPTIONS.map((d) => ({ value: d.months, label: d.label }))}
          value={deadlineMonths}
          onChange={onDeadlineMonths}
        />
        <div {...stylex.props(styles.when)}>
          <span {...stylex.props(styles.whenLabel)}>期限</span>
          <span {...stylex.props(styles.whenValue)}>{due ? ym(due) : '—'}</span>
          <span {...stylex.props(styles.whenLabel)}>
            この期限から、1日あたり何時間必要かを逆算します
          </span>
        </div>
      </div>

      <div {...stylex.props(styles.block, styles.nameRow)}>
        <label {...stylex.props(styles.q)} htmlFor="displayName">
          名前
        </label>
        <input
          id="displayName"
          {...stylex.props(styles.input)}
          type="text"
          value={name}
          placeholder="（任意）"
          onChange={(e) => onName(e.target.value)}
        />
        <span {...stylex.props(styles.hint)}>表示用です。空のままでも動きます。</span>
      </div>
    </Card>
  );
}
