import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { layerByKey, layerOfRate } from '@/lib/calc';

const styles = stylex.create({
  box: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: '10px',
    marginTop: '14px',
    padding: '12px 14px',
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
  },
  label: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted },
  name: { fontFamily: fonts.serif, fontSize: '16px', fontWeight: 600, color: colors.accent },
  summary: { fontFamily: fonts.sans, fontSize: '12.5px', color: colors.textMuted },
});

export function RateNote({ rate, label }: { rate: number; label: string }) {
  const layer = layerByKey(layerOfRate(rate));
  return (
    <div {...stylex.props(styles.box)}>
      <span {...stylex.props(styles.label)}>{label}</span>
      <span {...stylex.props(styles.name)}>{layer.name}</span>
      <span {...stylex.props(styles.summary)}>{layer.summary}</span>
    </div>
  );
}
