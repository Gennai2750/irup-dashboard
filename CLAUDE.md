# CLAUDE.md

このファイルは **「どう書くか」** を決めます。
**「何を作るか」** は `docs/仕様書.md`、**使う値** は `docs/データ定義.md` にあります。
**3つとも読んでから作業を始めてください。**

> このプロジェクトのゴールは、**複数人が別々に作っても同じものが出来上がること**です。
> そのために、ここに書いてある名前・構成・書き方は**好みで変えないでください。**
> 「もっと良い書き方」を思いついても、ここに書いてあるほうを使ってください。

---

## 1. スタック（変更しない）

| 領域 | 使うもの | 備考 |
| --- | --- | --- |
| フレームワーク | **Next.js 15.5** / App Router | 16 系にしない（理由は §2） |
| 言語 | **TypeScript** | `strict: true` |
| スタイル | **StyleX 0.19** | `@stylexjs/babel-plugin` ＋ `@stylexjs/postcss-plugin` |
| 状態管理 | **React の `useState` / `useMemo` のみ** | Redux / Zustand / Jotai などを入れない |
| フォント | Google Fonts を `<link>` で読み込む | `next/font` は使えない（§2） |

### 追加してはいけないもの

- **UI ライブラリ**（MUI / Chakra / shadcn / Tailwind など）
- **グラフライブラリ**（Recharts / Chart.js / D3 など）。帯も横棒も素の要素の幅で作る
- **状態管理ライブラリ**
- **日付ライブラリ**（date-fns / dayjs など）。`Date` で足りる
- **フォームライブラリ**

`package.json` の `dependencies` は次の4つだけです。

```
@stylexjs/stylex, next (15.5.x), react (19), react-dom (19)
```

---

## 2. セットアップの注意（ここでほぼ全員が詰まります）

### Next.js は 15 系に固定する

StyleX の公式セットアップは Babel プラグイン方式です。
**Babel を使うと SWC が無効になり、Turbopack が使えません。**
Next.js 16 は Turbopack が既定なので噛み合いません。webpack が既定の 15 系を使ってください。

- `next dev` に **`--turbopack` を付けない**
- `next/font` も Babel 構成では使えない。フォントは `app/layout.tsx` の `<link>` で読み込む

### `@babel/runtime` は v7 に固定する

`next/babel` プリセットは `@babel/runtime` を別途必要とします。
v8 は `./regenerator` を export しなくなったため、**v8 だとビルドが落ちます**。
`devDependencies` で `"@babel/runtime": "^7"` に固定してください。

### dev サーバーを止めてからビルドする

`npm run build` の前に必ず `next dev` を止めること。
動かしたまま `rm -rf .next && npm run build` をすると、
サーバーが本番チャンクを読みに行って `Cannot find module './239.js'` の 500 が出ます。
（コードは無傷。停止 → `.next` 削除 → dev 再起動で直ります）

---

## 3. StyleX の書き方（最重要）

### ショートハンドは黙って捨てられる

**`border` / `borderTop` / `borderBottom` / `borderLeft` / `borderRight` を使わないでください。**
StyleX はこれらを**エラーも警告も出さずに捨てます**。枠線だけが消えた画面ができあがります。

```ts
// ✗ 効かない。しかも何も言われない
border: `1px solid ${colors.border}`,

// ○ longhand で書く
borderWidth: '1px',
borderStyle: 'solid',
borderColor: colors.border,
```

メディアクエリの中でも同じです。

```ts
// ✗
borderLeft: { default: `1px solid ${colors.border}`, '@media (max-width: 900px)': 'none' },

// ○
borderLeftWidth: { default: '1px', '@media (max-width: 900px)': 0 },
borderLeftStyle: 'solid',
borderLeftColor: colors.border,
```

`padding` / `margin` / `gap` / `flex` / `transition` のショートハンドは問題なく通ります。

### そのほかの落とし穴

- `<span>` に `height` を効かせたいときは `display: 'block'` を明示する（インライン要素に高さは効かない）
- 動的な値（幅・位置）は `stylex.create` の**関数スタイル**で書く

```ts
const dyn = stylex.create({
  width: (pct: number) => ({ width: `${pct}%` }),
});
// 使うとき
<span {...stylex.props(styles.fill, dyn.width(40))} />
```

- 条件付きの適用は `stylex.props(a, cond && b)` の形にする

### 書けたら確認する

```bash
grep -rn "border[A-Za-z]*:.*\(solid\|dotted\|dashed\)" app components | grep -v "Style:"
```

**1件でも出たら直してください。**（`borderTopStyle: 'solid'` のような longhand だけが残る状態が正解）

---

## 4. ファイル構成（このとおりに作る）

```
app/
  layout.tsx            html/head。フォントを <link> で読み込む
  globals.css           リセット ＋ @stylex ディレクティブ
  tokens.stylex.ts      色・フォント・角丸・影のトークン
  page.tsx              状態（FormState）とタブ切り替え。状態はここ1か所だけ
lib/
  constants.ts          仕様で指定された固定値・選択肢・技術項目
  calc.ts               計算だけの純関数。JSX を書かない
  format.ts             表示整形だけ。計算しない
components/
  ui/
    Card.tsx            番号バッジ＋見出しのカード
    ChoiceButtons.tsx   ボタン択一
    HourInput.tsx       時間の数値入力（0.5刻み）
    SkillChecklist.tsx  チェックボックス＋理解度プルダウン
  hearing/
    Block01Role.tsx  Block02CurrentRate.tsx  Block03Skills.tsx
    Block04SoftSkills.tsx  Block05Free.tsx  Block06Goal.tsx
    RateNote.tsx        単価からレイヤーを出す小さな表示
    HearingTab.tsx
  result/
    Verdict.tsx         毎日の処方（一番上）
    Section01Layer.tsx  Section02Estimate.tsx  Section03Roadmap.tsx
    Section04Pace.tsx   Section05Stock.tsx     Section06Soft.tsx
    Section07Next.tsx   Sources.tsx
    ResultTab.tsx
docs/
  仕様書.md  データ定義.md
```

**ファイル名・ディレクトリ名を変えないでください。** 揃わなくなります。

---

## 5. 名前（このとおりに使う）

出力を揃えるうえで、ここがいちばん効きます。**同じものに同じ名前を付けてください。**

### `lib/constants.ts`

```
WEEKS_PER_MONTH  DAYS_PER_WEEK  DAYS_PER_MONTH  HOURS_PER_DAY  MONTHS_PER_YEAR
ROLES  RoleKey
RATE_OPTIONS  RATE_STEP  CURRENT_RATE_MAX  CURRENT_RATE_OPTIONS
LAYERS  LayerKey  LAYER_ORDER
SKILL_LEVELS  SkillLevel  TEACH_MULTIPLIER_BY_LAYER  TRIED_PROGRESS  REQUIRE_TEACH_BELOW_TARGET
SkillItem  ROLE_SKILLS  SOFT_SKILLS
HOLIDAY_OPTIONS  DEADLINE_OPTIONS  DEADLINE_PATTERNS
```

### `lib/calc.ts`

```
FormState  initialState  Derived  GapItem
clampHours  layerOfRate  layerByKey
progressHours  requiredLevelOf  requiredHours  remainingHours
derive  targetDate  dailyStudyForMonths  shareOfFree  groupSkills
```

### `lib/format.ts`

```
n1     小数第1位まで（3.0 / 117.4）
n0     整数に四捨五入（34 / 79）
trunc1 小数第1位で切り捨て（21.75 → 21.7）※月の日数だけに使う
hours  時間の合計を整数で
hm     時間を「2時間13分」「30分」の形に
ym     「2028年9月」
monthCount  月数（1ヶ月未満は切り上げ）
span   「2年2ヶ月」「9ヶ月」
```

### 型の形

```ts
export type SkillItem = {
  name: string;
  useHours: number;    // 「扱える」までの標準学習時間
  teachHours: number;  // 「教えられる」までの標準学習時間
  layer: LayerKey;
};
```

---

## 6. 数値の扱い（違反すると出力がズレます）

1. **指定されていない係数・補正値を作らない。**
   「空き時間のうち実際に使える割合は70%くらい」のような数字を勝手に掛けないこと。
   使ってよいのは `lib/constants.ts` に置いた値と、暦の定数（24時間 / 7日 / 4.35週）だけです。

2. **`docs/データ定義.md` の値をそのまま写す。** 自分で計算し直さない（丸めでズレます）。

3. **0 で割らない。** 割れないときは `null` を返し、画面には `—` と出す。

4. **試算のために置いた前提は、画面に明示する。**
   `TRIED_PROGRESS`（かじった＝50%）、`REQUIRE_TEACH_BELOW_TARGET`、
   標準学習時間が実測値でないこと。これらは結果タブ 02 に必ず書く。

5. **計算は `lib/calc.ts` の純関数にまとめる。** 画面の都合を持ち込まない。JSX を書かない。

---

## 7. 画面の約束

- **「計算する」ボタンを作らない。** 入力が変わった時点で `useMemo` が計算し直す
- **状態は `app/page.tsx` の 1 か所だけ。** 2つのタブは同じ状態を見る。タブを行き来しても消えない
- **保存・送信・ログインをしない。** サーバー通信は一切なし
- **極端な入力で壊れない。** 合計が24時間を超える、空き時間0、未チェック0件、名前が空 — すべてで動くこと
- **`NaN` / `Infinity` / `undefined` を画面に出さない**
- **判定文は事実だけ。** 届かない人を否定する書き方をしない
- **`07 今日、最初に手をつけること` は必ず空欄。** 学習内容の提案・診断文を1文字も書かない

### 日付の扱い

到達年月の基準日は、**描画後に `useEffect` で入れる**こと。
`useState<Date | null>(null)` で持ち、入るまでは `—` を出します。
レンダリング中に `new Date()` を呼ぶと、サーバーとクライアントで値が食い違って hydration エラーになります。

---

## 8. 見た目

落ち着いた業務資料の見た目にします。

| 役割 | 指定 |
| --- | --- |
| ページ背景 | 温かみのある薄いグレー |
| カード | 白 |
| 文字 | 黒に近いグレー（補助テキストはやや薄く） |
| 罫線 | 薄いグレー |
| **アクセント** | **朱色1色のみ** |
| 見出し | 明朝体 |
| 本文・ラベル | ゴシック体 |
| 数字 | 等幅・桁揃え（`fontVariantNumeric: 'tabular-nums'`） |

**やらないこと**：グラデーション／派手な影／大きな角丸（2〜3px まで）／アイコン・絵文字／アニメーション（ホバーの短い色変化を除く）／アクセント色を増やす。

**幅**：中央寄せ1カラム、最大1000px程度。375px でも読めること。
表がはみ出る場合は**表だけ**を横スクロールさせ、ページ全体を横スクロールさせない。

---

## 9. 進め方

1. `docs/仕様書.md` と `docs/データ定義.md` を読む
2. `lib/constants.ts` → `lib/calc.ts` → `lib/format.ts` の順に作る（画面より先に計算を固める）
3. `app/tokens.stylex.ts` と `components/ui/` を作る
4. ヒアリングタブ（01〜06）→ 結果タブ（判定＋01〜07）
5. **`docs/仕様書.md` の「検算表」と数字を突き合わせる**
6. **「受け入れ条件」を上から順に確認する**

### 確認コマンド

```bash
npx tsc --noEmit                      # 型エラーがないこと
npm run build                         # dev を止めてから
```

分からないことが出てきたら、**勝手に決めずに仕様書を読み直してください。**
仕様書にも書いていなければ、**その場で作らずに質問してください。**
勝手に決めた数字が、全員の出力がズレる原因になります。
