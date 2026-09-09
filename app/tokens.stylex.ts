import * as stylex from '@stylexjs/stylex';

/**
 * 画面全体で使う値はここに集約する。
 * 色は「無彩色 ＋ アクセント1色（朱色）」だけ。装飾用のグラデーションは持たせない。
 */
export const colors = stylex.defineVars({
  // 背景・面
  pageBg: '#f4f2ee', // 少し温かみのある薄いグレー
  cardBg: '#ffffff',
  subtleBg: '#faf9f6',
  // 文字
  text: '#1f1f1f', // 黒に近いグレー
  textMuted: '#5c5a55',
  textFaint: '#8b8880',
  // 罫線
  border: '#d8d4cb',
  borderStrong: '#b9b4a9',
  // アクセント（朱色：印章のような、少しくすんだ赤）1色のみ
  accent: '#b23b2e',
  accentText: '#ffffff',
  accentWeak: '#f0dedb',
  accentBorder: '#d8a49c',
  // 図表の対比用（帯グラフの「残り」）
  deepBlue: '#2f4a63',
});

export const fonts = stylex.defineVars({
  // 見出し＝明朝体
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',
  // 本文＝ゴシック体
  sans: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
  // 数字＝等幅
  mono: '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
});

export const shape = stylex.defineVars({
  radius: '3px',
  radiusSm: '2px',
  shadow: '0 1px 2px rgba(31, 31, 31, 0.06)',
});
