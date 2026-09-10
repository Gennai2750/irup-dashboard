'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { DAYS_PER_MONTH, TRIED_PROGRESS } from '@/lib/constants';
import { targetDate, type Derived, type FormState } from '@/lib/calc';
import { hm, hours, n0, n1, span, ym } from '@/lib/format';

const styles = stylex.create({
  cols: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 860px)': '1fr' },
    gap: '18px',
  },
  table: { width: '100%' },
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
  },
  td: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    color: colors.text,
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.border,
    paddingTop: '8px',
    paddingBottom: '8px',
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
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  sub: { fontFamily: fonts.sans, fontSize: '11px', color: colors.textFaint, marginLeft: '6px' },
  totalRow: { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: colors.borderStrong },
  tdTotal: {
    fontFamily: fonts.sans,
    fontSize: '13px',
    fontWeight: 700,
    color: colors.text,
    paddingTop: '10px',
  },
  tdTotalNum: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '15px',
    fontWeight: 700,
    color: colors.accent,
    textAlign: 'right',
    paddingTop: '10px',
  },
  result: { display: 'flex', flexDirection: 'column', gap: '12px' },
  big: {
    padding: '16px 18px',
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
  },
  bigLabel: {
    display: 'block',
    fontFamily: fonts.sans,
    fontSize: '12px',
    color: colors.textMuted,
    marginBottom: '6px',
  },
  bigValue: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '30px',
    fontWeight: 700,
    lineHeight: 1,
    color: colors.accent,
  },
  bigSub: {
    display: 'block',
    fontFamily: fonts.sans,
    fontSize: '12px',
    color: colors.textMuted,
    marginTop: '8px',
  },
  formula: {
    fontFamily: fonts.mono,
    fontSize: '12px',
    lineHeight: 1.9,
    color: colors.textMuted,
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
    padding: '12px 14px',
    overflowX: 'auto',
    whiteSpace: 'pre-line',
  },
  assume: {
    marginTop: '20px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingTop: '14px',
  },
  assumeHead: {
    fontFamily: fonts.serif,
    fontSize: '13px',
    fontWeight: 600,
    color: colors.text,
    marginBottom: '8px',
  },
  list: { margin: 0, paddingLeft: '18px' },
  li: { fontFamily: fonts.sans, fontSize: '11.5px', lineHeight: 1.9, color: colors.textMuted },
  warn: {
    fontFamily: fonts.sans,
    fontSize: '12.5px',
    color: colors.accent,
    marginTop: '10px',
    padding: '9px 11px',
    backgroundColor: colors.accentWeak,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.accentBorder,
    borderRadius: shape.radiusSm,
  },
});

export function Section02Estimate({
  s,
  d,
  today,
}: {
  s: FormState;
  d: Derived;
  today: Date | null;
}) {
  const due = today ? targetDate(today, d.deadlineMonths) : null;
  const rows = [
    { label: '技術', note: `不足 ${d.gapSkills.length} 項目`, value: d.techHours },
    { label: '技術以外の能力', note: `不足 ${d.gapSoftSkills.length} 項目`, value: d.softHours },
  ];

  return (
    <Card no="02" title="1日あたりの逆算">
      <div {...stylex.props(styles.cols)}>
        <div>
          <table {...stylex.props(styles.table)}>
            <thead>
              <tr>
                <th {...stylex.props(styles.th)} scope="col">
                  期限までにやりきる学習
                </th>
                <th {...stylex.props(styles.thNum)} scope="col">
                  時間
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td {...stylex.props(styles.td)}>
                    {r.label}
                    <span {...stylex.props(styles.sub)}>{r.note}</span>
                  </td>
                  <td {...stylex.props(styles.tdNum)}>{hours(r.value)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr {...stylex.props(styles.totalRow)}>
                <td {...stylex.props(styles.tdTotal)}>合計</td>
                <td {...stylex.props(styles.tdTotalNum)}>{hours(d.totalHours)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div {...stylex.props(styles.result)}>
          <div {...stylex.props(styles.big)}>
            <span {...stylex.props(styles.bigLabel)}>1日あたり必要な学習時間</span>
            <span {...stylex.props(styles.bigValue)}>{hm(d.dailyStudy)}</span>
            <span {...stylex.props(styles.bigSub)}>
              {due ? `期限 ${ym(due)}` : ''}
            </span>
          </div>
          <div {...stylex.props(styles.formula)}>
            {hours(d.totalHours)} h ÷ ( {d.deadlineMonths} ヶ月 × {DAYS_PER_MONTH.toFixed(2)} 日 ){'\n'}
            ＝ 1日 {n1(d.dailyStudy)} h
          </div>
          {!d.feasible ? (
            <p {...stylex.props(styles.warn)}>
              1日の空き時間 {n1(d.dailyFree)} 時間を {hm(d.overBy)} 超えています。
              {d.minMonthsWithinFree !== null
                ? `期限を ${span(d.minMonthsWithinFree)}後にすると収まります。`
                : ''}
            </p>
          ) : d.dailyShareOfFree !== null ? (
            <p {...stylex.props(styles.bigSub)}>
              1日の空き時間 {n1(d.dailyFree)} 時間の {n0(d.dailyShareOfFree)} ％です。
            </p>
          ) : null}
        </div>
      </div>

      <div {...stylex.props(styles.assume)}>
        <p {...stylex.props(styles.assumeHead)}>この試算の前提</p>
        <ul {...stylex.props(styles.list)}>
          <li {...stylex.props(styles.li)}>
            各項目には「<strong>扱えるまで</strong>（手を動かして成果物を出せる）」と「
            <strong>教えられるまで</strong>（なぜそれを選んだかを説明でき、人に教えられる）」の
            2 つの標準学習時間を持たせています。資格試験の学習時間の目安をもとに置いた値で、実測値ではありません。
          </li>
          <li {...stylex.props(styles.li)}>
            <strong>目標レイヤーの技術は「扱える」まで、それより下のレイヤーの技術は「教えられる」まで</strong>
            を到達点にしています。AI が出した答えを後から説明し、技術選定の根拠を持つには、
            土台になっている層を「なぜそれを選んだのか」まで言える必要があるためです。
          </li>
          <li {...stylex.props(styles.li)}>
            すでに投じ終えた時間の数え方：教えられる＝教えられるまでの時間 ／ 扱える＝扱えるまでの時間 ／
            かじった＝扱えるまでの時間の {Math.round(TRIED_PROGRESS * 100)}％ ／ 未チェック＝0。
          </li>
          <li {...stylex.props(styles.li)}>
            1ヶ月＝{DAYS_PER_MONTH.toFixed(2)}日（4.35週×7日）。1日あたりの空き時間は、
            月の空き時間をこの日数でならしたものです。
          </li>
          <li {...stylex.props(styles.li)}>
            <strong>学習すれば単価が上がることを保証する計算ではありません。</strong>
            「その水準で求められる項目を、期限までに学び終えるには1日どれだけ要るか」を出しているだけです。
          </li>
        </ul>
      </div>
    </Card>
  );
}
