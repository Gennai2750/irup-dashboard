'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { SkillChecklist } from '@/components/ui/SkillChecklist';
import { SOFT_SKILLS, type SkillLevel } from '@/lib/constants';

const styles = stylex.create({
  lead: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
    marginBottom: '16px',
    lineHeight: 1.8,
  },
  count: { fontFamily: fonts.mono, fontVariantNumeric: 'tabular-nums' },
});

export function Block05SoftSkills({
  softSkills,
  onToggle,
  onLevel,
}: {
  softSkills: Record<string, SkillLevel>;
  onToggle: (name: string, checked: boolean) => void;
  onLevel: (name: string, level: SkillLevel) => void;
}) {
  const checked = SOFT_SKILLS.filter((i) => softSkills[i.name] !== undefined).length;
  return (
    <Card
      no="05"
      title="技術以外の能力"
      right={
        <>
          チェック <span {...stylex.props(styles.count)}>{checked}</span> / {SOFT_SKILLS.length}
        </>
      }
    >
      <p {...stylex.props(styles.lead)}>
        単価は技術だけで決まりません。設計より上のレイヤーでは、
        こちらが揃っているかどうかで差がつきます。
      </p>
      <SkillChecklist
        items={SOFT_SKILLS}
        held={softSkills}
        onToggle={onToggle}
        onLevel={onLevel}
      />
    </Card>
  );
}
