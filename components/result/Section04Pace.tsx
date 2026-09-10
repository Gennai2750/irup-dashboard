'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { DEADLINE_PATTERNS } from '@/lib/constants';
import { AI_DAILY_HOURS, dailyStudyForMonths, targetDate, type Derived } from '@/lib/calc';
import { hm, n0, n1, span, ym } from '@/lib/format';

const styles = stylex.create({
  lead: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.textMuted,
    lineHeight: 1.8,
    marginBottom: '14px',
  },
  wrap: { overflowX: 'auto' },
  table: { width: '100%', minWidth: '620px' },
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
  current: { color: colors.accent, fontWeight: 700 },
  over: { color: colors.textFaint },
  empty: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted, padding: '18px 0' },
  note: {
    fontFamily: fonts.sans,
    fontSize: '11px',
    lineHeight: 1.8,
    color: colors.textFaint,
    marginTop: '12px',
  },
});

export function Section04Pace({ d, today }: { d: Derived; today: Date | null }) {
  if (d.alreadyThere) {
    return (
      <Card no="04" title="期限を変えると、1日あたりがどう変わるか">
        <p {...stylex.props(styles.empty)}>
          必要な項目は揃っているため、期限の比較はありません。
        </p>
      </Card>
    );
  }

  return (
    <Card no="04" title="期限を変えると、1日あたりがどう変わるか">
      <p {...stylex.props(styles.lead)}>
        残り {Math.round(d.totalHours)} 時間を、期限を変えて割った場合です。
        どの行にも、毎日の AI キャッチアップ {hm(d.aiDaily)} が含まれています。
        いま選んでいる期限を朱色で示しています。
      </p>
      <div {...stylex.props(styles.wrap)}>
        <table {...stylex.props(styles.table)}>
          <thead>
            <tr>
              <th {...stylex.props(styles.th)} scope="col">
                期限
              </th>
              <th {...stylex.props(styles.th)} scope="col">
                いつ
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                技術など
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                ＋AI
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                1日の合計
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                空き時間の
              </th>
            </tr>
          </thead>
          <tbody>
            {DEADLINE_PATTERNS.map((m) => {
              const study = dailyStudyForMonths(d.totalHours, m);
              const total = study + AI_DAILY_HOURS;
              const over = total > d.dailyFree;
              const isCurrent = m === d.deadlineMonths;
              const due = today ? targetDate(today, m) : null;
              const share = d.dailyFree > 0 ? (total / d.dailyFree) * 100 : null;
              return (
                <tr key={m}>
                  <th {...stylex.props(styles.td, isCurrent && styles.current)} scope="row">
                    {span(m)}後
                  </th>
                  <td {...stylex.props(styles.td)}>{due ? ym(due) : '—'}</td>
                  <td {...stylex.props(styles.tdNum)}>{n1(study)}</td>
                  <td {...stylex.props(styles.tdNum)}>{n1(AI_DAILY_HOURS)}</td>
                  <td {...stylex.props(styles.tdNum, isCurrent && styles.current)}>{hm(total)}</td>
                  <td {...stylex.props(styles.tdNum, over && styles.over)}>
                    {share === null ? '—' : over ? '超える' : `${n0(share)} ％`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p {...stylex.props(styles.note)}>
        「超える」の行は、いまの空き時間（1日 {n1(d.dailyFree)} 時間）では足りない期限です。
      </p>
    </Card>
  );
}
