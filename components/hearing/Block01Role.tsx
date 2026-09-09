'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { ChoiceButtons } from '@/components/ui/ChoiceButtons';
import { ROLES, type RoleKey } from '@/lib/constants';

const styles = stylex.create({
  q: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, marginBottom: '10px' },
  note: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint, marginTop: '12px' },
});

export function Block01Role({
  role,
  onRole,
}: {
  role: RoleKey;
  onRole: (v: RoleKey) => void;
}) {
  return (
    <Card no="01" title="現在の職種">
      <p {...stylex.props(styles.q)}>いまの仕事に一番近いもの</p>
      <ChoiceButtons
        name="職種"
        options={ROLES.map((r) => ({ value: r.key, label: r.label }))}
        value={role}
        onChange={onRole}
      />
      <p {...stylex.props(styles.note)}>
        選んだ職種によって、03 に出る技術項目が変わります。
      </p>
    </Card>
  );
}
