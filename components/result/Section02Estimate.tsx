'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { AI_HOURS_PER_STEP, DAYS_PER_MONTH, SKILL_LEVELS } from '@/lib/constants';
import { arrivalDate, type Derived, type FormState } from '@/lib/calc';
import { hours, monthCount, n0, n1, span, ym } from '@/lib/format';

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
  tdTotal: { fontFamily: fonts.sans, fontSize: '13px', fontWeight: 700, color: colors.text, paddingTop: '10px' },
  tdTotalNum: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '15px',
    fontWeight: 700,
    color: colors.accent,
    textAlign: 'right',
    paddingTop: '10px',
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  big: {
    padding: '16px 18px',
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
  },
  bigLabel: { display: 'block', fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted, marginBottom: '6px' },
  bigValue: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1,
    color: colors.accent,
  },
  bigUnit: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted, marginLeft: '4px' },
  bigSub: { display: 'block', fontFamily: fonts.sans, fontSize: '12px', color: colors.textMuted, marginTop: '8px' },
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
  const arrival = today !== null && d.months !== null ? arrivalDate(today, d.months) : null;
  const rows = [
    { label: '技術', note: `不足 ${d.gapSkills.length} 項目`, value: d.techHours },
    { label: '技術以外の能力', note: `不足 ${d.gapSoftSkills.length} 項目`, value: d.softHours },
    {
      label: 'AI活用',
      note: d.aiGapSteps > 0 ? `レベル ${s.aiLevel} → ${d.requiredAiLevel}` : '必要水準に到達',
      value: d.aiHours,
    },
  ];

  return (
    <Card no="02" title="到達までの試算">
      <div {...stylex.props(styles.cols)}>
        <div>
          <table {...stylex.props(styles.table)}>
            <thead>
              <tr>
                <th {...stylex.props(styles.th)} scope="col">
                  残っている学習
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
            <span {...stylex.props(styles.bigLabel)}>到達までの期間</span>
            <span {...stylex.props(styles.bigValue)}>
              {d.alreadyThere ? '0' : monthCount(d.months)}
            </span>
            <span {...stylex.props(styles.bigUnit)}>ヶ月</span>
            <span {...stylex.props(styles.bigSub)}>
              {d.alreadyThere
                ? '必要な項目は揃っています'
                : arrival
                  ? `${span(d.months)} ＝ ${ym(arrival)}`
                  : '1日あたりの学習時間を入れてください'}
            </span>
          </div>
          <div {...stylex.props(styles.formula)}>
            {hours(d.totalHours)} h ÷ ( {n1(s.dailyStudy)} h/日 × {DAYS_PER_MONTH.toFixed(2)} 日/月 ){'\n'}
            ＝ {hours(d.totalHours)} h ÷ {n1(d.monthlyStudy)} h/月{'\n'}
            ＝ {d.months === null ? '—' : n1(d.months)} ヶ月
          </div>
          {d.overCapacity ? (
            <p {...stylex.props(styles.warn)}>
              1日{n1(s.dailyStudy)}時間の学習は、入力した空き時間（月{n1(d.monthlyFree)}
              時間）を超えています。
            </p>
          ) : d.studyShareOfFree !== null ? (
            <p {...stylex.props(styles.bigSub)}>
              月{n1(d.monthlyStudy)}時間は、空き時間の {n0(d.studyShareOfFree)} ％です。
            </p>
          ) : null}
        </div>
      </div>

      <div {...stylex.props(styles.assume)}>
        <p {...stylex.props(styles.assumeHead)}>この試算の前提</p>
        <ul {...stylex.props(styles.list)}>
          <li {...stylex.props(styles.li)}>
            各項目の標準学習時間は、資格試験の学習時間の目安をもとに置いた値です（例：AWS
            SAA は初心者50〜80時間・実務経験者20〜50時間とされる）。実測値ではありません。
          </li>
          <li {...stylex.props(styles.li)}>
            理解度に応じて、残っている学習時間を次の割合で数えています：
            {SKILL_LEVELS.map((l) => `${l.label} ${Math.round(l.remain * 100)}％`).join(' ／ ')}
            ／ 未チェック 100％。
          </li>
          <li {...stylex.props(styles.li)}>
            AI活用は、目標レイヤーで求められるレベルまで1段あたり
            {AI_HOURS_PER_STEP}時間として数えています。
          </li>
          <li {...stylex.props(styles.li)}>
            1ヶ月＝{DAYS_PER_MONTH.toFixed(2)}日（4.35週×7日）として計算しています。
          </li>
          <li {...stylex.props(styles.li)}>
            <strong>学習時間から単価が上がることを保証する計算ではありません。</strong>
            「その水準で求められる項目を、いまのペースで学び終えるのはいつか」を出しているだけです。
          </li>
        </ul>
      </div>
    </Card>
  );
}
