import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';

const styles = stylex.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radius,
    boxShadow: shape.shadow,
    padding: { default: '20px 22px 22px', '@media (max-width: 640px)': '16px 14px 18px' },
  },
  head: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    paddingBottom: '10px',
    marginBottom: '18px',
  },
  badge: {
    fontFamily: fonts.mono,
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: colors.accentText,
    backgroundColor: colors.accent,
    borderRadius: shape.radiusSm,
    padding: '3px 7px',
    flexShrink: 0,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: '17px',
    fontWeight: 600,
    color: colors.text,
    margin: 0,
    lineHeight: 1.4,
  },
  spacer: { marginLeft: 'auto' },
  right: {
    fontFamily: fonts.sans,
    fontSize: '12px',
    color: colors.textFaint,
  },
});

export function Card({
  no,
  title,
  right,
  children,
}: {
  no?: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.head)}>
        {no ? <span {...stylex.props(styles.badge)}>{no}</span> : null}
        <h2 {...stylex.props(styles.title)}>{title}</h2>
        {right ? (
          <span {...stylex.props(styles.spacer, styles.right)}>{right}</span>
        ) : null}
      </div>
      {children}
    </section>
  );
}
