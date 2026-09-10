import * as stylex from '@stylexjs/stylex';
import { colors, fonts } from '@/app/tokens.stylex';

const styles = stylex.create({
  wrap: {
    marginTop: '10px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingTop: '16px',
  },
  head: {
    fontFamily: fonts.serif,
    fontSize: '12px',
    fontWeight: 600,
    color: colors.textMuted,
    marginBottom: '8px',
  },
  p: {
    fontFamily: fonts.sans,
    fontSize: '11px',
    lineHeight: 1.9,
    color: colors.textFaint,
    marginBottom: '7px',
  },
});

export function Sources() {
  return (
    <div {...stylex.props(styles.wrap)}>
      <p {...stylex.props(styles.head)}>出典と、数値の性格</p>
      <p {...stylex.props(styles.p)}>
        単価帯：AWS関連のフリーランス公開案件では月60〜90万円が中心、上位帯で月100〜130万円とされる（2026年上半期）。インフラエンジニアは月55〜100万円、システムエンジニアは月50〜120万円が相場として示されている。いずれも人材紹介事業者が公開している相場記事にもとづく参考値で、公的統計ではありません。
      </p>
      <p {...stylex.props(styles.p)}>
        レイヤーの考え方：単価差は経験年数よりも担当レイヤー（運用／構築／設計／アーキテクト）と、IaC・コンテナ・セキュリティなどの掛け合わせスキルの有無で開くとされる。
      </p>
      <p {...stylex.props(styles.p)}>
        標準学習時間：AWS認定ソリューションアーキテクト アソシエイト（SAA）の学習時間は、初心者で50〜80時間、実務経験者で20〜50時間が目安とされる。本ダッシュボードの各項目の時間は、この水準を基準に置いた目安であり、実測値ではありません。
      </p>
      <p {...stylex.props(styles.p)}>
        学習状況の背景：勤務先以外での学習・自己啓発について「とくに何も行っていない」と答えた就業者は日本で52.6％、調査対象18ヵ国・地域中で最も高い＝パーソル総合研究所『グローバル就業実態・成長意識調査』（2022年）。
      </p>
      <p {...stylex.props(styles.p)}>
        「教えられるまで」の学習時間、理解度ごとの到達分の数え方は、1日あたりの必要時間を出すために置いた前提です。調査データではありません。02 に明示しています。
      </p>
    </div>
  );
}
