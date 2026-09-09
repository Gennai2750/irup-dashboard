'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';

const styles = stylex.create({
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '7px',
    paddingBottom: '7px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.border,
  },
  label: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text },
  inputWrap: { display: 'flex', alignItems: 'baseline', gap: '6px' },
  input: {
    fontFamily: fonts.mono,
    fontSize: '15px',
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
    color: colors.text,
    backgroundColor: colors.cardBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape.radiusSm,
    padding: '6px 8px',
    width: '84px',
    outline: 'none',
    borderColor: { default: colors.border, ':focus': colors.accent },
  },
  unit: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint },
});

export function HourInput({
  label,
  value,
  onChange,
  unit = '時間',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <label {...stylex.props(styles.row)}>
      <span {...stylex.props(styles.label)}>{label}</span>
      <span {...stylex.props(styles.inputWrap)}>
        <input
          {...stylex.props(styles.input)}
          type="number"
          inputMode="decimal"
          step={0.5}
          min={0}
          max={24}
          value={value}
          onChange={(e) => {
            const n = Number.parseFloat(e.target.value);
            onChange(Number.isFinite(n) ? n : 0);
          }}
        />
        <span {...stylex.props(styles.unit)}>{unit}</span>
      </span>
    </label>
  );
}
