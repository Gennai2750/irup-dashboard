import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';

const styles = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '13px', paddingBottom: '13px' },
  box: {
    display: 'block',
    width: '14px',
    height: '14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.borderStrong,
    borderRadius: shape.radiusSm,
    flexShrink: 0,
  },
  line: {
    display: 'block',
    flex: '1 1 auto',
    height: 0,
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.borderStrong,
  },
  tag: {
    fontFamily: fonts.sans,
    fontSize: '10.5px',
    color: colors.textMuted,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
    padding: '2px 7px',
  },
});

export function Section08Next() {
  return (
    <Card no="08" title="今日、最初に手をつけること" right={<span {...stylex.props(styles.tag)}>未記入</span>}>
      {[0, 1, 2].map((i) => (
        <div key={i} {...stylex.props(styles.row)}>
          <span {...stylex.props(styles.box)} />
          <span {...stylex.props(styles.line)} />
        </div>
      ))}
    </Card>
  );
}
