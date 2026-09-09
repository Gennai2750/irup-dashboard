'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';

const styles = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  btn: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    lineHeight: 1.4,
    color: colors.textMuted,
    backgroundColor: colors.cardBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape.radiusSm,
    padding: '7px 14px',
    transition: 'background-color 120ms, border-color 120ms, color 120ms',
    borderColor: { default: colors.border, ':hover': colors.borderStrong },
  },
  active: {
    color: colors.accentText,
    backgroundColor: colors.accent,
    borderColor: { default: colors.accent, ':hover': colors.accent },
    fontWeight: 500,
  },
  wide: { textAlign: 'left', width: '100%' },
});

export function ChoiceButtons<T extends string | number>({
  options,
  value,
  onChange,
  wide = false,
  name,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  wide?: boolean;
  name: string;
}) {
  return (
    <div {...stylex.props(styles.row)} role="group" aria-label={name}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          {...stylex.props(styles.btn, wide && styles.wide, o.value === value && styles.active)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
