'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { ChoiceButtons } from '@/components/ui/ChoiceButtons';
import { RATE_OPTIONS } from '@/lib/constants';
import { RateNote } from './RateNote';

const styles = stylex.create({
  q: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, marginBottom: '10px' },
  note: { fontFamily: fonts.sans, fontSize: '12px', color: colors.textFaint, marginTop: '12px' },
});

export function Block02CurrentRate({
  currentRate,
  onCurrentRate,
}: {
  currentRate: number;
  onCurrentRate: (v: number) => void;
}) {
  return (
    <Card no="02" title="現在の単価">
      <p {...stylex.props(styles.q)}>いまの月額単価（5万円刻み）</p>
      <ChoiceButtons
        name="現在の単価"
        options={RATE_OPTIONS.map((v) => ({ value: v, label: `${v}万` }))}
        value={currentRate}
        onChange={onCurrentRate}
      />
      <RateNote rate={currentRate} label="この単価帯は" />
      <p {...stylex.props(styles.note)}>
        分からない場合は、だいたいの金額で構いません。結果は目標との差だけを使います。
      </p>
    </Card>
  );
}
