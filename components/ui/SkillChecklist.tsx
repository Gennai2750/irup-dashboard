'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { LAYERS, SKILL_LEVELS, type SkillItem, type SkillLevel } from '@/lib/constants';

const styles = stylex.create({
  group: { marginBottom: '18px' },
  groupHead: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    paddingBottom: '6px',
    marginBottom: '4px',
  },
  groupName: { fontFamily: fonts.serif, fontSize: '14px', fontWeight: 600, color: colors.text },
  groupNote: { fontFamily: fonts.sans, fontSize: '11.5px', color: colors.textFaint },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    columnGap: '18px',
    rowGap: '2px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: '10px',
    minHeight: '38px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.border,
  },
  check: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: fonts.sans,
    fontSize: '13.5px',
    color: colors.text,
    cursor: 'pointer',
  },
  box: { width: '15px', height: '15px', accentColor: colors.accent, flexShrink: 0, margin: 0 },
  hrs: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '11px',
    color: colors.textFaint,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  select: {
    fontFamily: fonts.sans,
    fontSize: '12px',
    color: colors.text,
    backgroundColor: colors.cardBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape.radiusSm,
    padding: '4px 6px',
    outline: 'none',
    borderColor: { default: colors.border, ':focus': colors.accent },
  },
  hidden: { visibility: 'hidden' },
});

export function SkillChecklist({
  items,
  held,
  onToggle,
  onLevel,
  showLayerGroups = true,
}: {
  items: readonly SkillItem[];
  held: Record<string, SkillLevel>;
  onToggle: (name: string, checked: boolean) => void;
  onLevel: (name: string, level: SkillLevel) => void;
  showLayerGroups?: boolean;
}) {
  const groups = showLayerGroups
    ? LAYERS.map((l) => ({ layer: l, items: items.filter((i) => i.layer === l.key) })).filter(
        (g) => g.items.length > 0,
      )
    : [{ layer: null, items: [...items] }];

  return (
    <>
      {groups.map((g, gi) => (
        <div key={g.layer?.key ?? gi} {...stylex.props(styles.group)}>
          {g.layer ? (
            <div {...stylex.props(styles.groupHead)}>
              <span {...stylex.props(styles.groupName)}>{g.layer.name}</span>
              <span {...stylex.props(styles.groupNote)}>{g.layer.summary}</span>
            </div>
          ) : null}
          <div {...stylex.props(styles.grid)}>
            {g.items.map((item) => {
              const level = held[item.name];
              const checked = level !== undefined;
              return (
                <div key={item.name} {...stylex.props(styles.row)}>
                  <label {...stylex.props(styles.check)}>
                    <input
                      {...stylex.props(styles.box)}
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onToggle(item.name, e.target.checked)}
                    />
                    <span>{item.name}</span>
                    <span {...stylex.props(styles.hrs)}>
                      {item.useHours}／{item.teachHours}h
                    </span>
                  </label>
                  <select
                    {...stylex.props(styles.select, !checked && styles.hidden)}
                    aria-label={`${item.name} の理解度`}
                    aria-hidden={!checked}
                    tabIndex={checked ? 0 : -1}
                    value={level ?? 'doing'}
                    onChange={(e) => onLevel(item.name, e.target.value as SkillLevel)}
                  >
                    {SKILL_LEVELS.map((lv) => (
                      <option key={lv.value} value={lv.value}>
                        {lv.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
