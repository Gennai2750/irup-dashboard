'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { layerByKey, type Derived } from '@/lib/calc';
import { hours, monthCount, n1 } from '@/lib/format';

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
  no: {
    fontFamily: fonts.mono,
    fontVariantNumeric: 'tabular-nums',
    fontSize: '12px',
    color: colors.textFaint,
    borderBottomWidth: '1px',
    borderBottomStyle: 'dotted',
    borderBottomColor: colors.border,
    paddingTop: '9px',
    paddingBottom: '9px',
    paddingRight: '10px',
    width: '28px',
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
  layer: {
    fontFamily: fonts.sans,
    fontSize: '10.5px',
    color: colors.textMuted,
    backgroundColor: colors.subtleBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: shape.radiusSm,
    padding: '2px 6px',
    whiteSpace: 'nowrap',
  },
  level: { fontFamily: fonts.sans, fontSize: '11px', color: colors.textFaint, marginLeft: '8px' },
  month: { color: colors.accent, fontWeight: 700 },
  empty: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted, padding: '18px 0' },
  note: { fontFamily: fonts.sans, fontSize: '11px', lineHeight: 1.8, color: colors.textFaint, marginTop: '12px' },
});

export function Section03Roadmap({ d }: { d: Derived }) {
  if (d.gapSkills.length === 0) {
    return (
      <Card no="03" title="何を、どの順で学ぶか">
        <p {...stylex.props(styles.empty)}>
          目標のレイヤーで求められる技術は、すべてチェック済みです。
        </p>
      </Card>
    );
  }

  return (
    <Card no="03" title="何を、どの順で学ぶか" right={`${d.gapSkills.length} 項目`}>
      <p {...stylex.props(styles.lead)}>
        目標のレイヤーで求められる技術のうち、まだ学習時間が残っているものです。
        浅いレイヤーから、時間の短いものから並べています。
      </p>
      <div {...stylex.props(styles.wrap)}>
        <table {...stylex.props(styles.table)}>
          <thead>
            <tr>
              <th {...stylex.props(styles.th)} scope="col" />
              <th {...stylex.props(styles.th)} scope="col">
                学ぶこと
              </th>
              <th {...stylex.props(styles.th)} scope="col">
                レイヤー
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                標準
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                残り
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                累積
              </th>
              <th {...stylex.props(styles.thNum)} scope="col">
                完了
              </th>
            </tr>
          </thead>
          <tbody>
            {d.gapSkills.map((g, i) => {
              const m = d.monthlyStudy > 0 ? g.cumulative / d.monthlyStudy : null;
              return (
                <tr key={g.name}>
                  <td {...stylex.props(styles.no)}>{i + 1}</td>
                  <td {...stylex.props(styles.td)}>
                    {g.name}
                    {g.level ? (
                      <span {...stylex.props(styles.level)}>
                        いま：{g.level === 'doing' ? '業務でやっている' : 'かじった'}
                      </span>
                    ) : null}
                  </td>
                  <td {...stylex.props(styles.td)}>
                    <span {...stylex.props(styles.layer)}>{layerByKey(g.layer).name}</span>
                  </td>
                  <td {...stylex.props(styles.tdNum)}>{g.hours}</td>
                  <td {...stylex.props(styles.tdNum)}>{n1(g.remain)}</td>
                  <td {...stylex.props(styles.tdNum)}>{hours(g.cumulative)}</td>
                  <td {...stylex.props(styles.tdNum, styles.month)}>
                    {m === null ? '—' : `${monthCount(m)}ヶ月目`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p {...stylex.props(styles.note)}>
        「残り」は、標準学習時間に理解度の割合を掛けた時間です。「完了」は、
        上から順に学んだ場合に、その項目を学び終える月です。
      </p>
    </Card>
  );
}
