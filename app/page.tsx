'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shape } from './tokens.stylex';
import { HearingTab, type Setters } from '@/components/hearing/HearingTab';
import { ResultTab } from '@/components/result/ResultTab';
import { derive, initialState, type FormState } from '@/lib/calc';
import type { RoleKey, SkillLevel } from '@/lib/constants';

type TabKey = 'hearing' | 'result';

const styles = stylex.create({
  page: {
    minHeight: '100vh',
    backgroundColor: colors.pageBg,
    color: colors.text,
    fontFamily: fonts.sans,
  },
  inner: {
    maxWidth: '1000px',
    marginInline: 'auto',
    padding: { default: '32px 24px 72px', '@media (max-width: 640px)': '20px 14px 56px' },
  },
  header: { marginBottom: '20px' },
  title: {
    fontFamily: fonts.serif,
    fontSize: { default: '25px', '@media (max-width: 640px)': '20px' },
    fontWeight: 700,
    letterSpacing: '0.01em',
    color: colors.text,
    margin: 0,
  },
  who: { fontFamily: fonts.sans, fontSize: '13px', color: colors.textMuted, marginTop: '6px' },
  tabs: {
    display: 'flex',
    gap: '2px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.borderStrong,
    marginBottom: '20px',
  },
  tab: {
    fontFamily: fonts.sans,
    fontSize: '14px',
    color: colors.textMuted,
    backgroundColor: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderBottomWidth: 0,
    borderTopLeftRadius: shape.radiusSm,
    borderTopRightRadius: shape.radiusSm,
    padding: '10px 22px',
    marginBottom: '-1px',
  },
  tabActive: {
    color: colors.text,
    fontWeight: 500,
    backgroundColor: colors.cardBg,
    borderColor: colors.borderStrong,
    borderBottomWidth: '1px',
    borderBottomColor: colors.cardBg,
  },
  tabMark: {
    display: 'inline-block',
    width: '3px',
    height: '13px',
    backgroundColor: colors.accent,
    marginRight: '8px',
    verticalAlign: '-1px',
  },
});

export default function Home() {
  const [tab, setTab] = useState<TabKey>('hearing');
  const [state, setState] = useState<FormState>(initialState);

  // 到達年月の基準日。サーバとクライアントで値が食い違わないよう、描画後に入れる
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  // 入力が変わった時点で計算し直す（「計算する」ボタンは置かない）
  const derived = useMemo(() => derive(state), [state]);

  const set = useMemo<Setters>(
    () => ({
      role: (v: RoleKey) => setState((s) => ({ ...s, role: v })),
      currentRate: (v: number) => setState((s) => ({ ...s, currentRate: v })),
      goalRate: (v: number) => setState((s) => ({ ...s, goalRate: v })),
      skillToggle: (name: string, checked: boolean) =>
        setState((s) => {
          const next = { ...s.skills };
          if (checked) next[name] = 'use';
          else delete next[name];
          return { ...s, skills: next };
        }),
      skillLevel: (name: string, level: SkillLevel) =>
        setState((s) => ({ ...s, skills: { ...s.skills, [name]: level } })),
      softToggle: (name: string, checked: boolean) =>
        setState((s) => {
          const next = { ...s.softSkills };
          if (checked) next[name] = 'use';
          else delete next[name];
          return { ...s, softSkills: next };
        }),
      softLevel: (name: string, level: SkillLevel) =>
        setState((s) => ({ ...s, softSkills: { ...s.softSkills, [name]: level } })),
      aiLevel: (v: number) => setState((s) => ({ ...s, aiLevel: v })),
      weekdayFree: (v: number) => setState((s) => ({ ...s, weekdayFree: v })),
      holidayFree: (v: number) => setState((s) => ({ ...s, holidayFree: v })),
      holidayPerWeek: (v: number) => setState((s) => ({ ...s, holidayPerWeek: v })),
      dailyStudy: (v: number) => setState((s) => ({ ...s, dailyStudy: v })),
      name: (v: string) => setState((s) => ({ ...s, name: v })),
    }),
    [],
  );

  const goResult = useCallback(() => setTab('result'), []);

  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <header {...stylex.props(styles.header)}>
          <h1 {...stylex.props(styles.title)}>
            <span {...stylex.props(styles.tabMark)} />
            単価とスキルの棚卸しダッシュボード
          </h1>
          {state.name.trim() ? (
            <p {...stylex.props(styles.who)}>{state.name.trim()} さんの棚卸し</p>
          ) : null}
        </header>

        <div {...stylex.props(styles.tabs)} role="tablist" aria-label="画面切り替え">
          {(
            [
              ['hearing', 'ヒアリング'],
              ['result', '結果'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              {...stylex.props(styles.tab, tab === key && styles.tabActive)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'hearing' ? (
          <HearingTab state={state} derived={derived} set={set} onGoResult={goResult} />
        ) : (
          <ResultTab state={state} derived={derived} today={today} />
        )}
      </div>
    </main>
  );
}
