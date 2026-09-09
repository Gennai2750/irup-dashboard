'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { SkillChecklist } from '@/components/ui/SkillChecklist';
import { ROLE_SKILLS, type RoleKey, type SkillLevel } from '@/lib/constants';

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

export function Block03Skills({
  role,
  skills,
  onToggle,
  onLevel,
}: {
  role: RoleKey;
  skills: Record<string, SkillLevel>;
  onToggle: (name: string, checked: boolean) => void;
  onLevel: (name: string, level: SkillLevel) => void;
}) {
  const items = ROLE_SKILLS[role];
  const checked = items.filter((i) => skills[i.name] !== undefined).length;

  return (
    <Card
      no="03"
      title="現在の保有技術"
      right={
        <>
          チェック <span {...stylex.props(styles.count)}>{checked}</span> / {items.length}
        </>
      }
    >
      <p {...stylex.props(styles.lead)}>
        できるものにチェックを入れ、理解度を選んでください。項目の横の数字は、
        その技術を身につけるための標準学習時間です。
      </p>
      <SkillChecklist items={items} held={skills} onToggle={onToggle} onLevel={onLevel} />
    </Card>
  );
}
