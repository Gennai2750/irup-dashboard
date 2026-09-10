'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { LAYERS, LAYER_ORDER, RATE_OPTIONS, RATE_STEP } from '@/lib/constants';
import type { Derived } from '@/lib/calc';

const styles = stylex.create({
  lead: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
    lineHeight: 1.8,
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(5, 1fr)',
      '@media (max-width: 1000px)': 'repeat(3, 1fr)',
      '@media (max-width: 700px)': '1fr',
    },
    gap: '10px',
  },
  cell: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
    padding: '14px 14px 12px',
    backgroundColor: colors.cardBg,
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  passed: { backgroundColor: colors.subtleBg },
  current: { borderWidth: '2px', borderColor: colors.borderStrong, padding: '13px 13px 11px' },
  target: { borderWidth: '2px', borderColor: colors.accent, padding: '13px 13px 11px' },
  future: { opacity: 0.55 },
  range: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '12px',
    fontWeight: 700,
    color: colors.textMuted,
    letterSpacing: '0.02em',
  },
  name: { fontFamily: fonts.serif, fontSize: '15px', fontWeight: 600, color: colors.text },
  summary: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted, lineHeight: 1.7 },
  ai: {
    fontFamily: fonts.sans,
    fontSize: '11.5px',
    color: colors.textFaint,
    borderTopWidth: '1px',
    borderTopStyle: 'dotted',
    borderTopColor: colors.border,
    paddingTop: '7px',
  },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
  tagNow: {
    fontFamily: fonts.sans,
    fontSize: '10.5px',
    fontWeight: 500,
    color: colors.text,
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.borderStrong,
    borderRadius: shape.radiusSm,
    padding: '2px 6px',
  },
  tagGoal: {
    fontFamily: fonts.sans,
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: colors.accentText,
    backgroundColor: colors.accent,
    borderRadius: shape.radiusSm,
    padding: '3px 7px',
  },
  note: { fontFamily: fonts.sans, fontSize: '11px', lineHeight: 1.8, color: colors.textFaint, marginTop: '14px' },
});

function rangeLabel(i: number): string {
  const lower = i === 0 ? RATE_OPTIONS[0] : LAYERS[i - 1].maxRate + RATE_STEP;
  if (i === LAYERS.length - 1) return `${lower}万〜`;
  return `${lower}〜${LAYERS[i].maxRate}万`;
}

export function Section01Layer({ d }: { d: Derived }) {
  const cur = LAYER_ORDER[d.currentLayer];
  const tgt = LAYER_ORDER[d.targetLayer];

  return (
    <Card no="01" title="単価は、どのレイヤーを持てるかで決まる">
      <p {...stylex.props(styles.lead)}>
        単価の差は、経験年数よりも「担当できるレイヤー」で開きます。
        いまの位置と、目標の位置を並べています。
      </p>
      <div {...stylex.props(styles.grid)}>
        {LAYERS.map((l, i) => {
          const isCurrent = i === cur;
          const isTarget = i === tgt;
          return (
            <div
              key={l.key}
              {...stylex.props(
                styles.cell,
                i < cur && styles.passed,
                isCurrent && styles.current,
                isTarget && styles.target,
                i > tgt && styles.future,
              )}
            >
              <span {...stylex.props(styles.range)}>{rangeLabel(i)}</span>
              <span {...stylex.props(styles.name)}>{l.name}</span>
              <span {...stylex.props(styles.summary)}>{l.summary}</span>
              <span {...stylex.props(styles.ai)}>AI活用レベル {l.aiLevel} 以上</span>
              <span {...stylex.props(styles.tags)}>
                {isCurrent ? <span {...stylex.props(styles.tagNow)}>いまここ</span> : null}
                {isTarget ? <span {...stylex.props(styles.tagGoal)}>目標</span> : null}
              </span>
            </div>
          );
        })}
      </div>
      <p {...stylex.props(styles.note)}>
        レイヤーの区切りと単価帯は、公開されている単価相場の記事をもとに置いた目安です。
        社内の実単価に合わせて調整してください。
      </p>
    </Card>
  );
}
