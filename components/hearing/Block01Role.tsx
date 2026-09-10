'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { ROLES, type RoleKey } from '@/lib/constants';

const styles = stylex.create({
  q: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, marginBottom: '12px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(3, 1fr)',
      '@media (max-width: 900px)': 'repeat(2, 1fr)',
      '@media (max-width: 600px)': '1fr',
    },
    gap: '8px',
  },
  btn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '5px',
    textAlign: 'left',
    backgroundColor: colors.cardBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape.radiusSm,
    padding: '12px 14px',
    transition: 'background-color 120ms, border-color 120ms',
    borderColor: { default: colors.border, ':hover': colors.borderStrong },
  },
  active: {
    backgroundColor: colors.accent,
    borderColor: { default: colors.accent, ':hover': colors.accent },
  },
  label: { fontFamily: fonts.sans, fontSize: '13.5px', fontWeight: 500, color: colors.text },
  labelActive: { color: colors.accentText },
  hint: { fontFamily: fonts.sans, fontSize: '11.5px', lineHeight: 1.6, color: colors.textMuted },
  hintActive: { color: colors.accentWeak },
  note: {
    fontFamily: fonts.sans,
    fontSize: '12px',
    lineHeight: 1.9,
    color: colors.textFaint,
    marginTop: '14px',
  },
});

export function Block01Role({ role, onRole }: { role: RoleKey; onRole: (v: RoleKey) => void }) {
  return (
    <Card no="01" title="現在の職種">
      <p {...stylex.props(styles.q)}>いま、あなたが主に触っているものはどれですか</p>
      <div {...stylex.props(styles.grid)} role="group" aria-label="職種">
        {ROLES.map((r) => {
          const on = r.key === role;
          return (
            <button
              key={r.key}
              type="button"
              aria-pressed={on}
              onClick={() => onRole(r.key)}
              {...stylex.props(styles.btn, on && styles.active)}
            >
              <span {...stylex.props(styles.label, on && styles.labelActive)}>{r.label}</span>
              <span {...stylex.props(styles.hint, on && styles.hintActive)}>{r.hint}</span>
            </button>
          );
        })}
      </div>
      <p {...stylex.props(styles.note)}>
        「作業の名前」ではなく「触っている対象」で選んでください。
        たとえばキッティングでも、サーバのラッキングや初期構築ならインフラ（オンプレ・サーバ）、
        利用者のPCのセットアップなら社内IT・ヘルプデスクです。
        <br />
        キッティング・ヘルプデスク・監視といった仕事の“深さ”は、職種ではなく単価のレイヤーで表します。
      </p>
    </Card>
  );
}
