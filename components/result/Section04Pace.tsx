'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { DAILY_STUDY_PATTERNS, DAYS_PER_MONTH } from '@/lib/constants';
import { arrivalDate, monthsAtDailyStudy, shareOfFree, type Derived, type FormState } from '@/lib/calc';
import { monthCount, n0, n1, span, ym } from '@/lib/format';

const styles = stylex.create({
  lead: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
    lineHeight: 1.8,
    marginBottom: '14px',
  },
  wrap: { overflowX: 'auto' },
  table: { width: '100%', minWidth: '560px' },
  th: {
    fontFamily: fonts.sans,
    fontSize: '11.5px',
    fontWeight: 500,
    color: colors.textMuted,
    textAlign: 'left',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.borderStrong,
    paddingBottom: '6px',
    paddingRight: '10px',
  },
  thNum: {
    fontFamily: fonts.sans,
    fontSize: '11.5px',
    fontWeight: 500,
    color: colors.textMuted,
    textAlign: 'right',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.borderStrong,
    paddingBottom: '6px',
    paddingLeft: '10px',
  },
  td: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.text,
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.border,
    paddingTop: '9px',
    paddingBottom: '9px',
    paddingRight: '10px',
  },
  tdNum: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '13px',
    color: colors.text,
    textAlign: 'right',
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.border,
    paddingTop: '9px',
    paddingBottom: '9px',
    paddingLeft: '10px',
  },
  pace: { fontFamily: fonts.mono, fontVariantNumeric: 'tabular-nums', fontWeight: 700 },
  current: { color: colors.accent, fontWeight: 700 },
  over: { color: colors.textFaint },
  empty: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted, padding: '18px 0' },
  note: { fontFamily: fonts.sans, fontSize: '11px', lineHeight: 1.8, color: colors.textFaint, marginTop: '12px' },
});

export function Section04Pace({
  s,
  d,
  today,
}: {
  s: FormState;
  d: Derived;
  today: Date | null;
}) {
  if (d.alreadyThere) {
    return (
      <Card no="04" title="1日あたりの学習時間で、いつ変わるか">
        <p {...stylex.props(styles.empty)}>
          必要な項目は揃っているため、期間の比較はありません。
        </p>
      </Card>
    );
  }

  return (
    <Card no="04" title="1日あたりの学習時間で、いつ変わるか">
      <p {...stylex.props(styles.lead)}>
        残り {Math.round(d.totalHours)} 時間を、1日あたりのペースを変えて学んだ場合です。
        いま選んでいるペースを朱色で示しています。
      </p>
      <div {...stylex.props(styles.wrap)}>
        <table {...stylex.props(styles.table)}>
          <thead>
            <tr>
              <th {...stylex.props(styles.th)} scope="col">
                1日あたり
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                月の学習時間
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                空き時間の
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                期間
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                到達
              </th>
            </tr>
          </thead>
          <tbody>
            {DAILY_STUDY_PATTERNS.map((p) => {
              const monthly = p * DAYS_PER_MONTH;
              const m = monthsAtDailyStudy(d.totalHours, p);
              const share = shareOfFree(monthly, d.monthlyFree);
              const over = monthly > d.monthlyFree;
              const isCurrent = Math.abs(p - s.dailyStudy) < 0.001;
              const arrival = today !== null && m !== null ? arrivalDate(today, m) : null;
              return (
                <tr key={p}>
                  <th {...stylex.props(styles.td)} scope="row">
                    <span {...stylex.props(styles.pace, isCurrent && styles.current)}>
                      {n1(p)}
                    </span>{' '}
                    時間
                  </th>
                  <td {...stylex.props(styles.tdNum)}>{n1(monthly)}</td>
                  <td {...stylex.props(styles.tdNum, over && styles.over)}>
                    {share === null ? '—' : over ? '超える' : `${n0(share)} ％`}
                  </td>
                  <td {...stylex.props(styles.tdNum, isCurrent && styles.current)}>
                    {span(m)}
                  </td>
                  <td {...stylex.props(styles.tdNum, isCurrent && styles.current)}>
                    {arrival ? ym(arrival) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p {...stylex.props(styles.note)}>
        「空き時間の」が「超える」となっている行は、06 で入力した空き時間では足りないペースです。
      </p>
    </Card>
  );
}
