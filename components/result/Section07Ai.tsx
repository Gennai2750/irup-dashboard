'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { AI_DAILY_MINUTES, AI_LEVELS } from '@/lib/constants';
import { layerByKey, type Derived } from '@/lib/calc';

const styles = stylex.create({
  lead: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
    lineHeight: 1.8,
    marginBottom: '14px',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '6px' },
  row: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 13px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
    backgroundColor: colors.cardBg,
  },
  done: { backgroundColor: colors.subtleBg },
  need: { borderWidth: '2px', borderColor: colors.accent, padding: '10px 12px' },
  future: { opacity: 0.5 },
  no: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '12px',
    fontWeight: 700,
    color: colors.textFaint,
    width: '14px',
    textAlign: 'right',
  },
  noDone: { color: colors.text },
  noNeed: { color: colors.accent },
  label: { fontFamily: fonts.sans, fontSize: '13.5px', color: colors.text },
  mark: { fontFamily: fonts.sans, fontSize: '11px', color: colors.textFaint, whiteSpace: 'nowrap' },
  tag: {
    fontFamily: fonts.sans,
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: colors.accentText,
    backgroundColor: colors.accent,
    borderRadius: shape.radiusSm,
    padding: '3px 7px',
    whiteSpace: 'nowrap',
  },
  note: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted, marginTop: '12px', lineHeight: 1.8 },
});

export function Section07Ai({ aiLevel, d }: { aiLevel: number; d: Derived }) {
  const required = d.requiredAiLevel;
  return (
    <Card no="07" title="AI活用の現在地">
      <p {...stylex.props(styles.lead)}>
        目標の「{layerByKey(d.targetLayer).name}」で求められるのは、レベル {required} 以上です。
      </p>
      <div {...stylex.props(styles.list)}>
        {AI_LEVELS.map((label, i) => {
          const level = i + 1;
          const done = level <= aiLevel;
          const need = level === required && level > aiLevel;
          return (
            <div
              key={label}
              {...stylex.props(
                styles.row,
                done && styles.done,
                need && styles.need,
                !done && !need && styles.future,
              )}
            >
              <span {...stylex.props(styles.no, done && styles.noDone, need && styles.noNeed)}>
                {level}
              </span>
              <span {...stylex.props(styles.label)}>{label}</span>
              {need ? (
                <span {...stylex.props(styles.tag)}>ここまで</span>
              ) : done ? (
                <span {...stylex.props(styles.mark)}>済み</span>
              ) : (
                <span {...stylex.props(styles.mark)} />
              )}
            </div>
          );
        })}
      </div>
      <p {...stylex.props(styles.note)}>
        {d.aiGapSteps > 0
          ? `レベル ${aiLevel} から ${required} まで、あと ${d.aiGapSteps} 段です。`
          : '目標のレイヤーで求められる水準には、すでに届いています。'}
        {`　ここは「◯時間やれば終わり」ではありません。3年かけて知識だけを積んでも、AIを使えなければ価値になりません。毎日 ${AI_DAILY_MINUTES} 分、最新情報に触れ続けることを前提に置いています。`}
      </p>
    </Card>
  );
}
