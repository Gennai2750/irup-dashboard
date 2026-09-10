/**
 * 固定値の置き場所。
 * ここに置いてよいのは「仕様で指定された数値」と「暦の定数」だけ。
 * 補正係数・稼働率のような“それらしい数字”を勝手に足さないこと。
 */

/** 1ヶ月＝4.35週（仕様指定） */
export const WEEKS_PER_MONTH = 4.35;
/** 1週＝7日（暦） */
export const DAYS_PER_WEEK = 7;
/** 1ヶ月の日数＝4.35週 × 7日 */
export const DAYS_PER_MONTH = WEEKS_PER_MONTH * DAYS_PER_WEEK;
/** 1日＝24時間（暦） */
export const HOURS_PER_DAY = 24;
/** 1ヶ月＝12分の1年（暦） */
export const MONTHS_PER_YEAR = 12;

/* ------------------------------------------------------------------ */
/* 職種                                                                */
/* ------------------------------------------------------------------ */

export const ROLES = [
  {
    key: 'infraOnPrem',
    label: 'インフラ（オンプレ・サーバ）',
    hint: '物理サーバ・OS・仮想化基盤を触っている',
  },
  {
    key: 'infraCloud',
    label: 'インフラ（クラウド）',
    hint: 'AWS / Azure / GCP のコンソールや IaC を触っている',
  },
  {
    key: 'network',
    label: 'ネットワーク',
    hint: 'ルータ・スイッチ・ファイアウォールの設定を触っている',
  },
  {
    key: 'internalIT',
    label: '社内IT・ヘルプデスク',
    hint: '利用者のPC・アカウント・問い合わせを扱っている',
  },
  {
    key: 'devFront',
    label: '開発（フロントエンド）',
    hint: '画面・UI のコードを書いている',
  },
  {
    key: 'devBack',
    label: '開発（バックエンド）',
    hint: 'サーバサイドのコードを書いている',
  },
] as const;

export type RoleKey = (typeof ROLES)[number]['key'];

/* ------------------------------------------------------------------ */
/* 単価とレイヤー                                                      */
/* ------------------------------------------------------------------ */

/** 単価の選択肢（万円／月・5万刻み） */
export const RATE_OPTIONS = [
  40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120,
] as const;

/** 単価の刻み（万円） */
export const RATE_STEP = 5;

/**
 * 担当レイヤー。
 * 調査では「単価差は経験年数より担当レイヤー（運用／構築／設計／アーキテクト）で開く」とされる。
 * maxRate は、そのレイヤーに対応する単価帯の上限（万円／月）。
 */
export const LAYERS = [
  {
    key: 'routine',
    name: '定型作業',
    maxRate: 45,
    summary: '手順書のとおりに、決められた作業を止めずに終わらせる',
    aiLevel: 1,
  },
  {
    key: 'ops',
    name: '運用・保守',
    maxRate: 55,
    summary: '手順の範囲で判断し、切り分けと一次対応ができる',
    aiLevel: 2,
  },
  {
    key: 'build',
    name: '構築',
    maxRate: 70,
    summary: '決まった設計を、自分の手で組み上げる',
    aiLevel: 3,
  },
  {
    key: 'design',
    name: '設計',
    maxRate: 90,
    summary: '要件から構成を決め、選んだ根拠を説明できる',
    aiLevel: 4,
  },
  {
    key: 'arch',
    name: 'アーキテクト・リード',
    maxRate: Number.POSITIVE_INFINITY,
    summary: '技術選定と全体設計を持ち、人を動かす',
    aiLevel: 5,
  },
] as const;

export type LayerKey = (typeof LAYERS)[number]['key'];

/** レイヤーの深さ（ops=0 … arch=3）。比較に使う */
export const LAYER_ORDER: Record<LayerKey, number> = {
  routine: 0,
  ops: 1,
  build: 2,
  design: 3,
  arch: 4,
};

/* ------------------------------------------------------------------ */
/* 理解度                                                              */
/* ------------------------------------------------------------------ */

/**
 * 理解度＝その項目にどこまで到達しているか。
 * 「扱える」と「教えられる」は別のゴールで、必要な時間も別に持つ。
 */
export const SKILL_LEVELS = [
  { value: 'teach', label: '教えられる', stockLabel: '人に教えられる' },
  { value: 'use', label: '扱える', stockLabel: '扱える' },
  { value: 'tried', label: 'かじった', stockLabel: 'かじった程度' },
] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number]['value'];

/**
 * 「教えられるまで」は「扱えるまで」の何倍か、のレイヤー別の目安。
 * 各項目の teachHours はこの倍率で置いた暫定値（5時間単位に丸め）。項目ごとに上書きしてよい。
 *
 * 手順どおりの作業は教えるのが比較的やさしく、運用・構築は「なぜその構成か」を
 * 説明できるまでの差が大きい。設計より上は、もともと説明そのものが仕事の中身なので差は小さい。
 */
export const TEACH_MULTIPLIER_BY_LAYER: Record<LayerKey, number> = {
  routine: 1.5,
  ops: 1.8,
  build: 1.8,
  design: 1.5,
  arch: 1.3,
};

/**
 * 「かじった」段階で、扱えるまでの時間の何割まで来ているとみなすか。
 * 到達時期を出すために置いた前提であり、調査データではない。画面に明示すること。
 */
export const TRIED_PROGRESS = 0.5;

/**
 * 目標レイヤーより下の技術に、「教えられる」まで求めるか。
 *
 * AI が出した答えを後から説明でき、技術選定の根拠を持つには、
 * 土台になっている層を「なぜそれを選んだのか」まで言える必要がある。
 * そのため、目標レイヤー自身の技術は「扱える」まで、
 * それより下のレイヤーの技術は「教えられる」までを到達点とする。
 */
export const REQUIRE_TEACH_BELOW_TARGET = true;

/* ------------------------------------------------------------------ */
/* AI活用                                                              */
/* ------------------------------------------------------------------ */

export const AI_LEVELS = [
  '触ったことがある',
  '調べもの・コードの相談に使う',
  '業務で毎日のように使う',
  'AIに道具を作らせる（スクリプト・ツールを自作）',
  '業務そのものを作り替える（設計・自動化に組み込む）',
] as const;

/**
 * AIの最新情報のキャッチアップに、毎日あてる時間（分）。
 *
 * AI活用は「◯時間やれば終わり」という学習ではない。
 * 3年かけて知識だけ積んでも、AIを使えなければ価値にならないため、
 * 期限つきの学習時間とは切り離し、毎日続ける習慣として固定で置く。
 */
export const AI_DAILY_MINUTES = 30;

/* ------------------------------------------------------------------ */
/* 技術項目                                                            */
/* ------------------------------------------------------------------ */

export type SkillItem = {
  /** 項目名 */
  name: string;
  /** 「扱える」＝手を動かして成果物を出せる、までの標準学習時間 */
  useHours: number;
  /** 「教えられる」＝なぜそれを選んだかを説明でき、人に教えられる、までの標準学習時間 */
  teachHours: number;
  /** この項目が求められ始めるレイヤー */
  layer: LayerKey;
};

/** 職種ごとの技術項目 */
export const ROLE_SKILLS: Record<RoleKey, readonly SkillItem[]> = {
  infraOnPrem: [
    { name: '手順書に沿ったサーバ作業', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'サーバのラッキング・配線', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'キッティング（サーバ初期セットアップ）', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: '監視画面の確認と一次報告', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'Linux の基本操作・シェル', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'Windows Server の基本操作', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'バックアップ・リストアの運用', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: '障害の切り分けと一次対応', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: '監視の設定と運用（Zabbix 等）', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: 'ネットワーク基礎（TCP/IP・ルーティング）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: '仮想化（VMware / KVM）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'ストレージ構成（RAID・SAN/NAS）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'ロードバランサ・冗長化構成', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'Ansible による構成管理', useHours: 40, teachHours: 70, layer: 'build' },
    { name: '容量・性能のサイジング', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '可用性設計（冗長化・DR）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'セキュリティ設計・監査対応', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '移行計画の策定', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'オンプレ↔クラウド移行の設計', useHours: 100, teachHours: 130, layer: 'arch' },
    { name: '全体構成の技術選定と説明責任', useHours: 100, teachHours: 130, layer: 'arch' },
  ],
  infraCloud: [
    { name: '手順書に沿ったクラウド作業', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'コンソールでの日常操作', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: '監視画面の確認と一次報告', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'Linux の基本操作・シェル', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'AWS の基本サービス（EC2/S3/VPC/RDS）', useHours: 60, teachHours: 110, layer: 'ops' },
    { name: 'IAM と権限管理の基本', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: '監視・ログ（CloudWatch）', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: 'コスト管理・請求の見方', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'Terraform による IaC', useHours: 60, teachHours: 110, layer: 'build' },
    { name: 'コンテナ（Docker）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'CI/CD パイプラインの構築', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'VPC・ネットワーク構成の構築', useHours: 60, teachHours: 110, layer: 'build' },
    { name: 'サーバーレス（Lambda・API Gateway）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'Kubernetes（EKS / ECS）', useHours: 100, teachHours: 180, layer: 'build' },
    { name: '可用性・DR 設計（マルチAZ／リージョン）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'セキュリティ設計（境界・暗号化・監査）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'コスト最適化の設計', useHours: 40, teachHours: 60, layer: 'design' },
    { name: '監視・オブザーバビリティの設計', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'マルチクラウド／移行アーキテクチャ', useHours: 100, teachHours: 130, layer: 'arch' },
    { name: '生成AI基盤（Bedrock / SageMaker）の構築', useHours: 100, teachHours: 130, layer: 'arch' },
    { name: '技術選定と全体設計の説明責任', useHours: 100, teachHours: 130, layer: 'arch' },
  ],
  // キャリア網のネットワーク構築案件（Cisco機器の遠隔設定、現地作業員への
  // 電話オペレーション、光モジュール・カードの実装）を踏まえた項目立て
  network: [
    { name: '手順書に沿った設定投入・削除（遠隔）', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: '現地作業員への電話オペレーション', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'ケーブルの接続・抜去の指示', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: '光モジュール・カードの実装（SFP / ラインカード / CPAK）', useHours: 30, teachHours: 45, layer: 'routine' },
    { name: 'Cisco 機器の基本操作（IOS / NX-OS）', useHours: 40, teachHours: 70, layer: 'ops' },
    { name: 'TCP/IP・サブネッティング', useHours: 40, teachHours: 70, layer: 'ops' },
    { name: 'VLAN・スイッチングの理解', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: '疎通確認と障害の切り分け', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: 'コンフィグの管理・バックアップ', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'ルーティング（OSPF / BGP）の設定', useHours: 60, teachHours: 110, layer: 'build' },
    { name: 'ファイアウォール・VPN の構築', useHours: 40, teachHours: 70, layer: 'build' },
    { name: '冗長化構成（HSRP/VRRP・リンクアグリゲーション）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'パケットキャプチャによる解析', useHours: 40, teachHours: 70, layer: 'build' },
    { name: '他部署との日程・稼働の調整', useHours: 30, teachHours: 55, layer: 'build' },
    { name: 'ネットワーク設計（セグメント・経路）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'キャリア網・広域網の設計', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'トラフィック・負荷の設計', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'セキュリティ設計（境界・アクセス制御）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '大規模ネットワークの全体設計', useHours: 100, teachHours: 130, layer: 'arch' },
    { name: '技術選定と説明責任', useHours: 100, teachHours: 130, layer: 'arch' },
  ],
  internalIT: [
    { name: 'PC のキッティング（初期セットアップ）', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: '利用者からの問い合わせ一次対応', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: '機器・ライセンスの資産管理', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'マニュアル・手順書に沿った作業', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'アカウント管理（Active Directory / Entra ID）', useHours: 40, teachHours: 70, layer: 'ops' },
    { name: 'ソフトウェアの配布・更新', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: '障害の切り分けとエスカレーション', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: '社内LAN・Wi-Fi の基礎', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: '問い合わせ内容の記録と分析', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'キッティングの自動化（Intune / MDM）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: '社内システムの導入・設定', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'SaaS の管理・権限設計', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'マニュアル整備と教育', useHours: 30, teachHours: 55, layer: 'build' },
    { name: '情報セキュリティの運用設計', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'IT資産・ライセンスの管理設計', useHours: 40, teachHours: 60, layer: 'design' },
    { name: 'ヘルプデスクの運用設計（SLA・体制）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '社内システムの選定', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '社内IT全体のグランドデザイン', useHours: 100, teachHours: 130, layer: 'arch' },
    { name: '予算策定とベンダーコントロール', useHours: 60, teachHours: 80, layer: 'arch' },
  ],
  devFront: [
    { name: 'HTML / CSS の基本', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: '既存画面の文言・画像の差し替え', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'Git によるチーム開発', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'JavaScript の基本', useHours: 40, teachHours: 70, layer: 'ops' },
    { name: '既存画面の修正・バグ対応', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'ブラウザ開発者ツールでの調査', useHours: 20, teachHours: 35, layer: 'ops' },
    { name: 'TypeScript', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'React または Vue', useHours: 60, teachHours: 110, layer: 'build' },
    { name: '状態管理の実装', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'API 連携（REST / GraphQL）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'テスト（単体・E2E）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'ビルド設定（Vite / webpack）', useHours: 30, teachHours: 55, layer: 'build' },
    { name: 'コンポーネント設計', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'アクセシビリティ対応', useHours: 40, teachHours: 60, layer: 'design' },
    { name: 'パフォーマンス最適化（Core Web Vitals）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '画面設計・UI仕様の策定', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '設計方針の策定とレビュー', useHours: 100, teachHours: 130, layer: 'arch' },
    { name: 'フレームワーク選定と移行計画', useHours: 100, teachHours: 130, layer: 'arch' },
  ],
  devBack: [
    { name: '既存機能の修正・バグ対応', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'Git によるチーム開発', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'ログの確認と一次調査', useHours: 20, teachHours: 30, layer: 'routine' },
    { name: 'プログラミング言語の基本（1つ）', useHours: 40, teachHours: 70, layer: 'ops' },
    { name: 'SQL の基本', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: 'Docker によるローカル環境構築', useHours: 30, teachHours: 55, layer: 'ops' },
    { name: 'Web フレームワーク（1つ）', useHours: 60, teachHours: 110, layer: 'build' },
    { name: 'REST API の実装', useHours: 40, teachHours: 70, layer: 'build' },
    { name: '認証・認可の実装', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'テスト実装（単体・結合）', useHours: 40, teachHours: 70, layer: 'build' },
    { name: '非同期処理・ジョブ管理', useHours: 40, teachHours: 70, layer: 'build' },
    { name: 'DB設計（正規化・インデックス）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'API設計（インターフェース定義）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: '性能設計・チューニング', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'セキュリティ設計（脆弱性対策）', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'トランザクション・整合性の設計', useHours: 60, teachHours: 90, layer: 'design' },
    { name: 'アーキテクチャ設計（モジュール分割）', useHours: 100, teachHours: 130, layer: 'arch' },
    { name: '技術選定と全体設計の説明責任', useHours: 100, teachHours: 130, layer: 'arch' },
  ],
};

/** 技術以外の能力（職種共通） */
export const SOFT_SKILLS: readonly SkillItem[] = [
  { name: '決められた手順を守って作業する', useHours: 20, teachHours: 30, layer: 'routine' },
  { name: '報告・連絡・相談', useHours: 20, teachHours: 30, layer: 'routine' },
  { name: '電話・メールでの対応', useHours: 20, teachHours: 35, layer: 'ops' },
  { name: '作業記録・日報を残す', useHours: 20, teachHours: 35, layer: 'ops' },
  { name: 'ドキュメント作成・仕様の言語化', useHours: 30, teachHours: 55, layer: 'build' },
  { name: '要件のヒアリング', useHours: 40, teachHours: 60, layer: 'design' },
  { name: '見積・工数の算出', useHours: 40, teachHours: 60, layer: 'design' },
  { name: 'レビュー・後輩の指導', useHours: 40, teachHours: 60, layer: 'design' },
  { name: '障害対応の指揮・報告', useHours: 40, teachHours: 60, layer: 'design' },
  { name: '顧客・他部署との折衝', useHours: 40, teachHours: 60, layer: 'design' },
  { name: 'チームマネジメント・進行管理', useHours: 60, teachHours: 80, layer: 'arch' },
  { name: '技術的な意思決定の説明', useHours: 60, teachHours: 80, layer: 'arch' },
  { name: '採用・面接', useHours: 30, teachHours: 40, layer: 'arch' },
];

/* ------------------------------------------------------------------ */
/* 空き時間・学習時間の初期値                                          */
/* ------------------------------------------------------------------ */

export const HOLIDAY_OPTIONS = [
  { value: 1, label: '週1日' },
  { value: 1.5, label: '週1.5日' },
  { value: 2, label: '週2日' },
  { value: 2.5, label: '週2.5日' },
  { value: 3, label: '週3日以上' },
] as const;

/** 「いつまでに達成したいか」の選択肢（ヶ月） */
export const DEADLINE_OPTIONS = [
  { months: 6, label: '半年後' },
  { months: 12, label: '1年後' },
  { months: 18, label: '1年半後' },
  { months: 24, label: '2年後' },
  { months: 36, label: '3年後' },
] as const;

/** 期限を変えたときの比較に使う刻み（結果タブの表） */
export const DEADLINE_PATTERNS = [6, 12, 18, 24, 36] as const;
