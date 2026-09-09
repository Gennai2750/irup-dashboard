'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { layerByKey, type Derived } from '@/lib/calc';
import { hours, n1 } from '@/lib/format';

const styles = stylex.create({
  lead: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
    lineHeight: 1.8,
    marginBottom: '14px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr auto auto', '@media (max-width: 640px)': '1fr auto' },
    alignItems: 'center',
    gap: '12px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.border,
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  name: { fontFamily: fonts.sans, fontSize: '13.5px', color: colors.text },
  layer: {
    fontFamily: fonts.sans,
    fontSize: '10.5px',
    color: colors.textMuted,
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
    padding: '2px 6px',
    whiteSpace: 'nowrap',
  },
  hrs: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '13px',
    color: colors.text,
    textAlign: 'right',
    minWidth: '56px',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '12px',
    padding: '11px 14px',
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
  },
  totalNum: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '20px',
    fontWeight: 700,
    color: colors.accent,
  },
  empty: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted, padding: '18px 0' },
});

export function Section06Soft({ d }: { d: Derived }) {
  if (d.gapSoftSkills.length === 0) {
    return (
      <Card no="06" title="技術以外で、足りていないもの">
        <p {...stylex.props(styles.empty)}>
          目標のレイヤーで求められる項目は、すべてチェック済みです。
        </p>
      </Card>
    );
  }
  return (
    <Card no="06" title="技術以外で、足りていないもの" right={`${d.gapSoftSkills.length} 項目`}>
      <p {...stylex.props(styles.lead)}>
        設計より上のレイヤーは、技術だけでは届きません。ここが空いていると、
        技術が揃っても単価が上がりにくくなります。
      </p>
      {d.gapSoftSkills.map((g) => (
        <div key={g.name} {...stylex.props(styles.row)}>
          <span {...stylex.props(styles.name)}>{g.name}</span>
          <span {...stylex.props(styles.layer)}>{layerByKey(g.layer).name}</span>
          <span {...stylex.props(styles.hrs)}>{n1(g.remain)} h</span>
        </div>
      ))}
      <div {...stylex.props(styles.total)}>
        <span>技術以外に残っている学習</span>
        <span>
          <span {...stylex.props(styles.totalNum)}>{hours(d.softHours)}</span> h
        </span>
      </div>
    </Card>
  );
}
