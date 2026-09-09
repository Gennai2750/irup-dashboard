'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { groupSkills } from '@/lib/calc';
import type { SkillLevel } from '@/lib/constants';

const styles = stylex.create({
  tier: { marginBottom: '16px' },
  head: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '7px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    paddingBottom: '6px',
    marginBottom: '10px',
  },
  title: { fontFamily: fonts.serif, fontSize: '14px', fontWeight: 600, color: colors.text },
  count: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '14px',
    fontWeight: 700,
    color: colors.accent,
  },
  countUnit: { fontFamily: fonts.sans, fontSize: '11px', color: colors.textMuted },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: {
    fontFamily: fonts.sans,
    fontSize: '12px',
    borderRadius: shape.radiusSm,
    padding: '4px 9px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  teach: { color: colors.accentText, backgroundColor: colors.accent, borderColor: colors.accent },
  doing: { color: colors.text, backgroundColor: colors.accentWeak, borderColor: colors.accentBorder },
  tried: { color: colors.textMuted, backgroundColor: colors.cardBg, borderColor: colors.border },
  none: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint },
  empty: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted, padding: '18px 0' },
});

const tierStyle = { teach: styles.teach, doing: styles.doing, tried: styles.tried } as const;

export function Section05Stock({
  title,
  no,
  held,
  names,
}: {
  title: string;
  no: string;
  held: Record<string, SkillLevel>;
  /** 表示する項目名。渡した場合、ここに無い項目は出さない（職種を変えたときの取り残しを防ぐ） */
  names?: readonly string[];
}) {
  // 職種を切り替えると、別職種でチェックした項目が held に残る。計算に入らないものは表示もしない
  const shown: Record<string, SkillLevel> = names
    ? Object.fromEntries(Object.entries(held).filter(([n]) => names.includes(n)))
    : held;
  const groups = groupSkills(shown);
  const total = Object.keys(shown).length;

  return (
    <Card no={no} title={title} right={`${total} 件`}>
      {total === 0 ? (
        <p {...stylex.props(styles.empty)}>ヒアリングのタブでチェックしてみてください</p>
      ) : (
        groups.map((g) => (
          <div key={g.value} {...stylex.props(styles.tier)}>
            <div {...stylex.props(styles.head)}>
              <span {...stylex.props(styles.title)}>{g.stockLabel}</span>
              <span {...stylex.props(styles.count)}>{g.items.length}</span>
              <span {...stylex.props(styles.countUnit)}>件</span>
            </div>
            {g.items.length === 0 ? (
              <p {...stylex.props(styles.none)}>—</p>
            ) : (
              <div {...stylex.props(styles.tags)}>
                {g.items.map((name) => (
                  <span key={name} {...stylex.props(styles.tag, tierStyle[g.value])}>
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </Card>
  );
}
