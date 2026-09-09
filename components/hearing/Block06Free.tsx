'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { ChoiceButtons } from '@/components/ui/ChoiceButtons';
import { HourInput } from '@/components/ui/HourInput';
import { HOLIDAY_OPTIONS, WEEKS_PER_MONTH } from '@/lib/constants';
import { n1, trunc1 } from '@/lib/format';

const styles = stylex.create({
  q: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, marginBottom: '10px' },
  gap: { marginTop: '20px' },
  list: { borderTopWidth: '1px', borderTopStyle: 'dotted', borderTopColor: colors.border },
  cells: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px' },
  cell: {
    flex: '1 1 150px',
    padding: '12px 14px',
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
  },
  cellLabel: {
    display: 'block',
    fontFamily: fonts.sans,
    fontSize: '12px',
    color: colors.textMuted,
    marginBottom: '4px',
  },
  cellValue: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '22px',
    fontWeight: 700,
    color: colors.text,
  },
  cellUnit: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted, marginLeft: '3px' },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '12px',
    marginTop: '10px',
    padding: '14px 16px',
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
  },
  totalLabel: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted },
  totalValue: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '30px',
    fontWeight: 700,
    lineHeight: 1,
    color: colors.accent,
  },
  totalUnit: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
    marginLeft: '4px',
  },
  note: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint, marginTop: '10px' },
});

export function Block06Free({
  weekdayFree,
  onWeekdayFree,
  holidayFree,
  onHolidayFree,
  holidayPerWeek,
  onHolidayPerWeek,
  weekdayDaysPerMonth,
  holidayDaysPerMonth,
  monthlyFree,
}: {
  weekdayFree: number;
  onWeekdayFree: (v: number) => void;
  holidayFree: number;
  onHolidayFree: (v: number) => void;
  holidayPerWeek: number;
  onHolidayPerWeek: (v: number) => void;
  weekdayDaysPerMonth: number;
  holidayDaysPerMonth: number;
  monthlyFree: number;
}) {
  return (
    <Card no="06" title="現在の空き時間">
      <p {...stylex.props(styles.q)}>週に何日休みですか</p>
      <ChoiceButtons
        name="週の休日数"
        options={HOLIDAY_OPTIONS}
        value={holidayPerWeek}
        onChange={onHolidayPerWeek}
      />
      <div {...stylex.props(styles.gap, styles.list)}>
        <HourInput label="平日1日の空き時間" value={weekdayFree} onChange={onWeekdayFree} />
        <HourInput label="休日1日の空き時間" value={holidayFree} onChange={onHolidayFree} />
      </div>
      <div {...stylex.props(styles.cells)}>
        <div {...stylex.props(styles.cell)}>
          <span {...stylex.props(styles.cellLabel)}>月の平日日数</span>
          <span {...stylex.props(styles.cellValue)}>{trunc1(weekdayDaysPerMonth)}</span>
          <span {...stylex.props(styles.cellUnit)}>日</span>
        </div>
        <div {...stylex.props(styles.cell)}>
          <span {...stylex.props(styles.cellLabel)}>月の休日日数</span>
          <span {...stylex.props(styles.cellValue)}>{trunc1(holidayDaysPerMonth)}</span>
          <span {...stylex.props(styles.cellUnit)}>日</span>
        </div>
      </div>
      <div {...stylex.props(styles.total)}>
        <span {...stylex.props(styles.totalLabel)}>月の空き時間</span>
        <span>
          <span {...stylex.props(styles.totalValue)}>{n1(monthlyFree)}</span>
          <span {...stylex.props(styles.totalUnit)}>時間</span>
        </span>
      </div>
      <p {...stylex.props(styles.note)}>1ヶ月＝{WEEKS_PER_MONTH}週として計算しています。</p>
    </Card>
  );
}
