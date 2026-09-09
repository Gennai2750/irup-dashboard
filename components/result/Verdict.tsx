'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import type { Derived, FormState } from '@/lib/calc';
import { arrivalDate } from '@/lib/calc';
import { hours, monthCount, n1, ym } from '@/lib/format';

const styles = stylex.create({
  box: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr auto', '@media (max-width: 900px)': '1fr' },
    gap: '20px',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors.accent,
    borderRadius: shape.radius,
    boxShadow: shape.shadow,
    padding: { default: '22px 24px', '@media (max-width: 640px)': '18px 16px' },
  },
  sentence: {
    fontFamily: fonts.serif,
    fontSize: { default: '20px', '@media (max-width: 640px)': '17px' },
    fontWeight: 600,
    lineHeight: 1.7,
    color: colors.text,
    margin: 0,
  },
  num: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    color: colors.accent,
    fontWeight: 700,
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap',
    borderLeftWidth: { default: '1px', '@media (max-width: 900px)': 0 },
    borderLeftStyle: 'solid',
    borderLeftColor: colors.border,
    borderTopWidth: { default: 0, '@media (max-width: 900px)': '1px' },
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingLeft: { default: '20px', '@media (max-width: 900px)': '0' },
    paddingTop: { default: '0', '@media (max-width: 900px)': '16px' },
  },
  stat: { paddingLeft: '14px', paddingRight: '14px', minWidth: '104px' },
  statLabel: {
    display: 'block',
    fontFamily: fonts.sans,
    fontSize: '11.5px',
    color: colors.textMuted,
    marginBottom: '5px',
    whiteSpace: 'nowrap',
  },
  statValue: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '24px',
    fontWeight: 700,
    color: colors.text,
    lineHeight: 1,
  },
  statUnit: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted, marginLeft: '2px' },
  accentValue: { color: colors.accent },
});

export function Verdict({
  s,
  d,
  today,
}: {
  s: FormState;
  d: Derived;
  today: Date | null;
}) {
  const arrival = today !== null && d.months !== null ? arrivalDate(today, d.months) : null;
  const gapCount = d.gapSkills.length + d.gapSoftSkills.length + (d.aiGapSteps > 0 ? 1 : 0);

  return (
    <div {...stylex.props(styles.box)}>
      {d.goalNotHigher ? (
        <p {...stylex.props(styles.sentence)}>
          目標が現在の単価と同じか、それより低くなっています。ヒアリングの 07
          で、上の単価を選んでください。
        </p>
      ) : d.alreadyThere ? (
        <p {...stylex.props(styles.sentence)}>
          {`月${s.goalRate}万円の水準で求められる項目は、すでに揃っています。`}
        </p>
      ) : d.months === null ? (
        <p {...stylex.props(styles.sentence)}>
          {`月${s.currentRate}万円から月${s.goalRate}万円まで、あと`}
          <span {...stylex.props(styles.num)}>{hours(d.totalHours)}</span>
          {'時間の学習が残っています。1日あたりの学習時間を入れると、到達時期が出ます。'}
        </p>
      ) : (
        <p {...stylex.props(styles.sentence)}>
          {`月${s.currentRate}万円から月${s.goalRate}万円まで、残り`}
          <span {...stylex.props(styles.num)}>{gapCount}</span>
          {'項目・'}
          <span {...stylex.props(styles.num)}>{hours(d.totalHours)}</span>
          {`時間。1日${n1(s.dailyStudy)}時間なら`}
          <span {...stylex.props(styles.num)}>{monthCount(d.months)}</span>
          {'ヶ月後'}
          {arrival ? `、${ym(arrival)}に届きます。` : 'に届きます。'}
        </p>
      )}

      <div {...stylex.props(styles.stats)}>
        <div {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statLabel)}>残っている学習</span>
          <span {...stylex.props(styles.statValue)}>{hours(d.totalHours)}</span>
          <span {...stylex.props(styles.statUnit)}>h</span>
        </div>
        <div {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statLabel)}>到達までの月数</span>
          <span {...stylex.props(styles.statValue, styles.accentValue)}>
            {d.alreadyThere ? '0' : monthCount(d.months)}
          </span>
          <span {...stylex.props(styles.statUnit)}>ヶ月</span>
        </div>
        <div {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statLabel)}>到達時期</span>
          <span {...stylex.props(styles.statValue)}>
            {d.alreadyThere ? '達成' : arrival ? ym(arrival) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
