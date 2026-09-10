'use client';

import * as stylex from '@stylexjs/stylex';
import { Verdict } from './Verdict';
import { Section01Layer } from './Section01Layer';
import { Section02Estimate } from './Section02Estimate';
import { Section03Roadmap } from './Section03Roadmap';
import { Section04Pace } from './Section04Pace';
import { Section05Stock } from './Section05Stock';
import { Section06Soft } from './Section06Soft';
import { Section07Ai } from './Section07Ai';
import { Section08Next } from './Section08Next';
import { Sources } from './Sources';
import type { Derived, FormState } from '@/lib/calc';
import { ROLE_SKILLS } from '@/lib/constants';

const styles = stylex.create({
  stack: { display: 'flex', flexDirection: 'column', gap: '16px' },
});

export function ResultTab({
  state,
  derived,
  today,
}: {
  state: FormState;
  derived: Derived;
  today: Date | null;
}) {
  return (
    <div {...stylex.props(styles.stack)}>
      <Verdict s={state} d={derived} today={today} />
      <Section01Layer d={derived} />
      <Section02Estimate s={state} d={derived} today={today} />
      <Section03Roadmap d={derived} />
      <Section04Pace d={derived} today={today} />
      <Section05Stock
        no="05"
        title="いまの技術在庫"
        held={state.skills}
        names={ROLE_SKILLS[state.role].map((i) => i.name)}
      />
      <Section06Soft d={derived} />
      <Section07Ai aiLevel={state.aiLevel} d={derived} />
      <Section08Next />
      <Sources />
    </div>
  );
}
