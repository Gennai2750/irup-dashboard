'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import type { Derived, FormState } from '@/lib/calc';
import { targetDate } from '@/lib/calc';
import { hm, hours, n0, n1, span, ym } from '@/lib/format';

const styles = stylex.create({
  box: {
    backgroundColor: colors.cardBg,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors.accent,
    borderRadius: shape.radius,
    boxShadow: shape.shadow,
    padding: { default: '24px 26px', '@media (max-width: 640px)': '18px 16px' },
  },
  head: {
    fontFamily: fonts.serif,
    fontSize: { default: '20px', '@media (max-width: 640px)': '17px' },
    fontWeight: 600,
    lineHeight: 1.7,
    color: colors.text,
    margin: 0,
    marginBottom: '18px',
  },
  num: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    color: colors.accent,
    fontWeight: 700,
  },
  plan: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingTop: '4px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: { default: 'auto 1fr', '@media (max-width: 560px)': '1fr' },
    alignItems: 'baseline',
    gap: '14px',
    paddingTop: '9px',
    paddingBottom: '9px',
  },
  amount: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '24px',
    fontWeight: 700,
    color: colors.accent,
    whiteSpace: 'nowrap',
    minWidth: '128px',
  },
  what: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, lineHeight: 1.7 },
  sub: { fontFamily: fonts.sans, fontSize: '11.5px', color: colors.textFaint, marginLeft: '8px' },
  totalRow: {
    display: 'grid',
    gridTemplateColumns: { default: 'auto 1fr', '@media (max-width: 560px)': '1fr' },
    alignItems: 'baseline',
    gap: '14px',
    marginTop: '6px',
    paddingTop: '12px',
  },
  totalAmount: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '26px',
    fontWeight: 700,
    color: colors.text,
    whiteSpace: 'nowrap',
    minWidth: '128px',
  },
  ok: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    lineHeight: 1.9,
    color: colors.textMuted,
  },
  ng: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    lineHeight: 1.9,
    color: colors.accent,
    marginTop: '14px',
    padding: '11px 13px',
    backgroundColor: colors.accentWeak,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.accentBorder,
    borderRadius: shape.radiusSm,
  },
  next: {
    marginTop: '18px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingTop: '14px',
  },
  nextHead: {
    fontFamily: fonts.serif,
    fontSize: '13px',
    fontWeight: 600,
    color: colors.text,
    marginBottom: '8px',
  },
  nextRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.text,
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  nextNo: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '11px',
    color: colors.textFaint,
  },
  nextDays: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '11.5px',
    color: colors.textMuted,
    marginLeft: 'auto',
    whiteSpace: 'nowrap',
  },
});

export function Verdict({ s, d, today }: { s: FormState; d: Derived; today: Date | null }) {
  const due = today ? targetDate(today, d.deadlineMonths) : null;

  if (d.goalNotHigher) {
    return (
      <div {...stylex.props(styles.box)}>
        <p {...stylex.props(styles.head)}>
          目標が現在の単価と同じか、それより低くなっています。ヒアリングの 07
          で、上の単価を選んでください。
        </p>
      </div>
    );
  }

  const nexts = [...d.gapSkills, ...d.gapSoftSkills].slice(0, 3);

  return (
    <div {...stylex.props(styles.box)}>
      <p {...stylex.props(styles.head)}>
        {due ? <span {...stylex.props(styles.num)}>{ym(due)}</span> : null}
        {due ? 'までに ' : ''}
        <span {...stylex.props(styles.num)}>月{s.goalRate}万円</span>
        {'へ。毎日これをやりましょう。'}
      </p>

      <div {...stylex.props(styles.plan)}>
        <div {...stylex.props(styles.totalRow)}>
          <span {...stylex.props(styles.totalAmount)}>毎日 {hm(d.dailyStudy)}</span>
          <span {...stylex.props(styles.ok)}>
            {d.alreadyThere ? (
              '必要な項目は揃っています'
            ) : (
              <>
                技術と、技術以外の学習
                <span {...stylex.props(styles.sub)}>
                  残り {hours(d.totalHours)}h ÷ {span(d.deadlineMonths)}
                </span>
                <br />
                1日の空き時間 {n1(d.dailyFree)} 時間
                {d.dailyShareOfFree === null ? '' : ` の ${n0(d.dailyShareOfFree)}％`}
              </>
            )}
          </span>
        </div>
      </div>

      {!d.feasible ? (
        <p {...stylex.props(styles.ng)}>
          このペースは、いまの空き時間より1日 {hm(d.overBy)} 多くなります。
          {d.minMonthsWithinFree !== null
            ? `空き時間のなかでやりきるなら、期限は ${span(d.minMonthsWithinFree)}後（${
                today ? ym(targetDate(today, d.minMonthsWithinFree)) : '—'
              }）が最短です。`
            : '空き時間がAIのキャッチアップだけで埋まってしまいます。まず空き時間を増やすところからです。'}
        </p>
      ) : null}

      {nexts.length > 0 ? (
        <div {...stylex.props(styles.next)}>
          <p {...stylex.props(styles.nextHead)}>まず、この順で手をつけます</p>
          {nexts.map((g, i) => (
            <div key={g.name} {...stylex.props(styles.nextRow)}>
              <span {...stylex.props(styles.nextNo)}>{i + 1}</span>
              <span>
                {g.name}
                <span {...stylex.props(styles.sub)}>
                  {g.requiredLevel === 'teach' ? '教えられるまで' : '扱えるまで'}
                </span>
              </span>
              <span {...stylex.props(styles.nextDays)}>
                残り {n1(g.remain)}h
                {d.dailyStudy > 0 ? ` ／ 約${Math.ceil(g.remain / d.dailyStudy)}日` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
