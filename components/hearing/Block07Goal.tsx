'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { ChoiceButtons } from '@/components/ui/ChoiceButtons';
import { HourInput } from '@/components/ui/HourInput';
import { RATE_OPTIONS } from '@/lib/constants';
import { n0, n1 } from '@/lib/format';
import { RateNote } from './RateNote';

const styles = stylex.create({
  q: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, marginBottom: '10px' },
  block: { marginTop: '22px' },
  list: { borderTopWidth: '1px', borderTopStyle: 'dotted', borderTopColor: colors.border },
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
  share: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint, marginTop: '10px' },
  num: { fontFamily: fonts.mono, fontVariantNumeric: 'tabular-nums', fontWeight: 500 },
  nameRow: { display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px' },
  input: {
    fontFamily: fonts.sans,
    fontSize: '14px',
    color: colors.text,
    backgroundColor: colors.cardBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape.radiusSm,
    padding: '8px 10px',
    outline: 'none',
    borderColor: { default: colors.border, ':focus': colors.accent },
  },
  hint: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint },
});

export function Block07Goal({
  goalRate,
  onGoalRate,
  goalNotHigher,
  dailyStudy,
  onDailyStudy,
  monthlyStudy,
  studyShareOfFree,
  overCapacity,
  name,
  onName,
}: {
  goalRate: number;
  onGoalRate: (v: number) => void;
  goalNotHigher: boolean;
  dailyStudy: number;
  onDailyStudy: (v: number) => void;
  monthlyStudy: number;
  studyShareOfFree: number | null;
  overCapacity: boolean;
  name: string;
  onName: (v: string) => void;
}) {
  return (
    <Card no="07" title="単価を幾らまで上げたいですか">
      <p {...stylex.props(styles.q)}>目標の月額単価（5万円刻み）</p>
      <ChoiceButtons
        name="目標の単価"
        options={RATE_OPTIONS.map((v) => ({ value: v, label: `${v}万` }))}
        value={goalRate}
        onChange={onGoalRate}
      />
      <RateNote rate={goalRate} label="そこは" />
      {goalNotHigher ? (
        <p {...stylex.props(styles.warn)}>
          目標が現在の単価と同じか、それより低くなっています。上の単価を選んでください。
        </p>
      ) : null}

      <div {...stylex.props(styles.block)}>
        <p {...stylex.props(styles.q)}>1日あたり、学習にどれくらい使いますか</p>
        <div {...stylex.props(styles.list)}>
          <HourInput label="1日あたりの学習時間" value={dailyStudy} onChange={onDailyStudy} />
        </div>
        <p {...stylex.props(styles.share)}>
          月 <span {...stylex.props(styles.num)}>{n1(monthlyStudy)}</span> 時間
          {studyShareOfFree === null
            ? '（空き時間が0時間です）'
            : `　＝　空き時間の ${n0(studyShareOfFree)} ％`}
        </p>
        {overCapacity ? (
          <p {...stylex.props(styles.warn)}>
            学習時間が、06 で入力した空き時間を超えています。
          </p>
        ) : null}
      </div>

      <div {...stylex.props(styles.block, styles.nameRow)}>
        <label {...stylex.props(styles.q)} htmlFor="displayName">
          名前
        </label>
        <input
          id="displayName"
          {...stylex.props(styles.input)}
          type="text"
          value={name}
          placeholder="（任意）"
          onChange={(e) => onName(e.target.value)}
        />
        <span {...stylex.props(styles.hint)}>表示用です。空のままでも動きます。</span>
      </div>
    </Card>
  );
}
