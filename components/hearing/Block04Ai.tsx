'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';
import { Card } from '@/components/ui/Card';
import { ChoiceButtons } from '@/components/ui/ChoiceButtons';
import { AI_LEVELS } from '@/lib/constants';

const styles = stylex.create({
  q: { fontFamily: fonts.sans, fontSize: '14px', color: colors.text, marginBottom: '10px' },
});

export function Block04Ai({
  aiLevel,
  onAiLevel,
}: {
  aiLevel: number;
  onAiLevel: (v: number) => void;
}) {
  return (
    <Card no="04" title="AIをどれだけ使ったことがあるか">
      <p {...stylex.props(styles.q)}>いまのAIの使い方に一番近いもの</p>
      <ChoiceButtons
        name="AIの使い方"
        wide
        options={AI_LEVELS.map((label, i) => ({ value: i + 1, label: `${i + 1}. ${label}` }))}
        value={aiLevel}
        onChange={onAiLevel}
      />
    </Card>
  );
}
