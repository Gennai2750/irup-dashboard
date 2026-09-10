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
 * 理解度と「残っている学習時間の割合」。
 * この4つの割合は、到達時期を出すために置いた“試算の前提”であり、
 * 調査データではない。画面上に必ず明示すること。
 */
export const SKILL_LEVELS = [
  { value: 'teach', label: '教えられる', stockLabel: '人に教えられる', remain: 0 },
  { value: 'doing', label: '業務でやっている', stockLabel: '業務でやっている', remain: 0.3 },
  { value: 'tried', label: 'かじった', stockLabel: 'かじった程度', remain: 0.6 },
] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number]['value'];

/** チェックしていない項目に残っている割合（＝まったく手をつけていない） */
export const UNCHECKED_REMAIN = 1;

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

/** AI活用を1段上げるための標準学習時間（試算の前提） */
export const AI_HOURS_PER_STEP = 20;

/* ------------------------------------------------------------------ */
/* 技術項目                                                            */
/* ------------------------------------------------------------------ */

export type SkillItem = {
  /** 項目名 */
  name: string;
  /** 標準学習時間（時間） */
  hours: number;
  /** この項目が求められ始めるレイヤー */
  layer: LayerKey;
};

/** 職種ごとの技術項目 */
export const ROLE_SKILLS: Record<RoleKey, readonly SkillItem[]> = {
  infraOnPrem: [
    { name: '手順書に沿ったサーバ作業', hours: 20, layer: 'routine' },
    { name: 'サーバのラッキング・配線', hours: 20, layer: 'routine' },
    { name: 'キッティング（サーバ初期セットアップ）', hours: 20, layer: 'routine' },
    { name: '監視画面の確認と一次報告', hours: 20, layer: 'routine' },
    { name: 'Linux の基本操作・シェル', hours: 20, layer: 'ops' },
    { name: 'Windows Server の基本操作', hours: 20, layer: 'ops' },
    { name: 'バックアップ・リストアの運用', hours: 20, layer: 'ops' },
    { name: '障害の切り分けと一次対応', hours: 30, layer: 'ops' },
    { name: '監視の設定と運用（Zabbix 等）', hours: 30, layer: 'ops' },
    { name: 'ネットワーク基礎（TCP/IP・ルーティング）', hours: 40, layer: 'build' },
    { name: '仮想化（VMware / KVM）', hours: 40, layer: 'build' },
    { name: 'ストレージ構成（RAID・SAN/NAS）', hours: 40, layer: 'build' },
    { name: 'ロードバランサ・冗長化構成', hours: 40, layer: 'build' },
    { name: 'Ansible による構成管理', hours: 40, layer: 'build' },
    { name: '容量・性能のサイジング', hours: 60, layer: 'design' },
    { name: '可用性設計（冗長化・DR）', hours: 60, layer: 'design' },
    { name: 'セキュリティ設計・監査対応', hours: 60, layer: 'design' },
    { name: '移行計画の策定', hours: 60, layer: 'design' },
    { name: 'オンプレ↔クラウド移行の設計', hours: 100, layer: 'arch' },
    { name: '全体構成の技術選定と説明責任', hours: 100, layer: 'arch' },
  ],
  infraCloud: [
    { name: '手順書に沿ったクラウド作業', hours: 20, layer: 'routine' },
    { name: 'コンソールでの日常操作', hours: 20, layer: 'routine' },
    { name: '監視画面の確認と一次報告', hours: 20, layer: 'routine' },
    { name: 'Linux の基本操作・シェル', hours: 20, layer: 'ops' },
    { name: 'AWS の基本サービス（EC2/S3/VPC/RDS）', hours: 60, layer: 'ops' },
    { name: 'IAM と権限管理の基本', hours: 30, layer: 'ops' },
    { name: '監視・ログ（CloudWatch）', hours: 30, layer: 'ops' },
    { name: 'コスト管理・請求の見方', hours: 20, layer: 'ops' },
    { name: 'Terraform による IaC', hours: 60, layer: 'build' },
    { name: 'コンテナ（Docker）', hours: 40, layer: 'build' },
    { name: 'CI/CD パイプラインの構築', hours: 40, layer: 'build' },
    { name: 'VPC・ネットワーク構成の構築', hours: 60, layer: 'build' },
    { name: 'サーバーレス（Lambda・API Gateway）', hours: 40, layer: 'build' },
    { name: 'Kubernetes（EKS / ECS）', hours: 100, layer: 'build' },
    { name: '可用性・DR 設計（マルチAZ／リージョン）', hours: 60, layer: 'design' },
    { name: 'セキュリティ設計（境界・暗号化・監査）', hours: 60, layer: 'design' },
    { name: 'コスト最適化の設計', hours: 40, layer: 'design' },
    { name: '監視・オブザーバビリティの設計', hours: 60, layer: 'design' },
    { name: 'マルチクラウド／移行アーキテクチャ', hours: 100, layer: 'arch' },
    { name: '生成AI基盤（Bedrock / SageMaker）の構築', hours: 100, layer: 'arch' },
    { name: '技術選定と全体設計の説明責任', hours: 100, layer: 'arch' },
  ],
  // キャリア網のネットワーク構築案件（Cisco機器の遠隔設定、現地作業員への
  // 電話オペレーション、光モジュール・カードの実装）を踏まえた項目立て
  network: [
    { name: '手順書に沿った設定投入・削除（遠隔）', hours: 20, layer: 'routine' },
    { name: '現地作業員への電話オペレーション', hours: 20, layer: 'routine' },
    { name: 'ケーブルの接続・抜去の指示', hours: 20, layer: 'routine' },
    { name: '光モジュール・カードの実装（SFP / ラインカード / CPAK）', hours: 30, layer: 'routine' },
    { name: 'Cisco 機器の基本操作（IOS / NX-OS）', hours: 40, layer: 'ops' },
    { name: 'TCP/IP・サブネッティング', hours: 40, layer: 'ops' },
    { name: 'VLAN・スイッチングの理解', hours: 30, layer: 'ops' },
    { name: '疎通確認と障害の切り分け', hours: 30, layer: 'ops' },
    { name: 'コンフィグの管理・バックアップ', hours: 20, layer: 'ops' },
    { name: 'ルーティング（OSPF / BGP）の設定', hours: 60, layer: 'build' },
    { name: 'ファイアウォール・VPN の構築', hours: 40, layer: 'build' },
    { name: '冗長化構成（HSRP/VRRP・リンクアグリゲーション）', hours: 40, layer: 'build' },
    { name: 'パケットキャプチャによる解析', hours: 40, layer: 'build' },
    { name: '他部署との日程・稼働の調整', hours: 30, layer: 'build' },
    { name: 'ネットワーク設計（セグメント・経路）', hours: 60, layer: 'design' },
    { name: 'キャリア網・広域網の設計', hours: 60, layer: 'design' },
    { name: 'トラフィック・負荷の設計', hours: 60, layer: 'design' },
    { name: 'セキュリティ設計（境界・アクセス制御）', hours: 60, layer: 'design' },
    { name: '大規模ネットワークの全体設計', hours: 100, layer: 'arch' },
    { name: '技術選定と説明責任', hours: 100, layer: 'arch' },
  ],
  internalIT: [
    { name: 'PC のキッティング（初期セットアップ）', hours: 20, layer: 'routine' },
    { name: '利用者からの問い合わせ一次対応', hours: 20, layer: 'routine' },
    { name: '機器・ライセンスの資産管理', hours: 20, layer: 'routine' },
    { name: 'マニュアル・手順書に沿った作業', hours: 20, layer: 'routine' },
    { name: 'アカウント管理（Active Directory / Entra ID）', hours: 40, layer: 'ops' },
    { name: 'ソフトウェアの配布・更新', hours: 30, layer: 'ops' },
    { name: '障害の切り分けとエスカレーション', hours: 30, layer: 'ops' },
    { name: '社内LAN・Wi-Fi の基礎', hours: 30, layer: 'ops' },
    { name: '問い合わせ内容の記録と分析', hours: 20, layer: 'ops' },
    { name: 'キッティングの自動化（Intune / MDM）', hours: 40, layer: 'build' },
    { name: '社内システムの導入・設定', hours: 40, layer: 'build' },
    { name: 'SaaS の管理・権限設計', hours: 40, layer: 'build' },
    { name: 'マニュアル整備と教育', hours: 30, layer: 'build' },
    { name: '情報セキュリティの運用設計', hours: 60, layer: 'design' },
    { name: 'IT資産・ライセンスの管理設計', hours: 40, layer: 'design' },
    { name: 'ヘルプデスクの運用設計（SLA・体制）', hours: 60, layer: 'design' },
    { name: '社内システムの選定', hours: 60, layer: 'design' },
    { name: '社内IT全体のグランドデザイン', hours: 100, layer: 'arch' },
    { name: '予算策定とベンダーコントロール', hours: 60, layer: 'arch' },
  ],
  devFront: [
    { name: 'HTML / CSS の基本', hours: 20, layer: 'routine' },
    { name: '既存画面の文言・画像の差し替え', hours: 20, layer: 'routine' },
    { name: 'Git によるチーム開発', hours: 20, layer: 'routine' },
    { name: 'JavaScript の基本', hours: 40, layer: 'ops' },
    { name: '既存画面の修正・バグ対応', hours: 20, layer: 'ops' },
    { name: 'ブラウザ開発者ツールでの調査', hours: 20, layer: 'ops' },
    { name: 'TypeScript', hours: 40, layer: 'build' },
    { name: 'React または Vue', hours: 60, layer: 'build' },
    { name: '状態管理の実装', hours: 40, layer: 'build' },
    { name: 'API 連携（REST / GraphQL）', hours: 40, layer: 'build' },
    { name: 'テスト（単体・E2E）', hours: 40, layer: 'build' },
    { name: 'ビルド設定（Vite / webpack）', hours: 30, layer: 'build' },
    { name: 'コンポーネント設計', hours: 60, layer: 'design' },
    { name: 'アクセシビリティ対応', hours: 40, layer: 'design' },
    { name: 'パフォーマンス最適化（Core Web Vitals）', hours: 60, layer: 'design' },
    { name: '画面設計・UI仕様の策定', hours: 60, layer: 'design' },
    { name: '設計方針の策定とレビュー', hours: 100, layer: 'arch' },
    { name: 'フレームワーク選定と移行計画', hours: 100, layer: 'arch' },
  ],
  devBack: [
    { name: '既存機能の修正・バグ対応', hours: 20, layer: 'routine' },
    { name: 'Git によるチーム開発', hours: 20, layer: 'routine' },
    { name: 'ログの確認と一次調査', hours: 20, layer: 'routine' },
    { name: 'プログラミング言語の基本（1つ）', hours: 40, layer: 'ops' },
    { name: 'SQL の基本', hours: 30, layer: 'ops' },
    { name: 'Docker によるローカル環境構築', hours: 30, layer: 'ops' },
    { name: 'Web フレームワーク（1つ）', hours: 60, layer: 'build' },
    { name: 'REST API の実装', hours: 40, layer: 'build' },
    { name: '認証・認可の実装', hours: 40, layer: 'build' },
    { name: 'テスト実装（単体・結合）', hours: 40, layer: 'build' },
    { name: '非同期処理・ジョブ管理', hours: 40, layer: 'build' },
    { name: 'DB設計（正規化・インデックス）', hours: 60, layer: 'design' },
    { name: 'API設計（インターフェース定義）', hours: 60, layer: 'design' },
    { name: '性能設計・チューニング', hours: 60, layer: 'design' },
    { name: 'セキュリティ設計（脆弱性対策）', hours: 60, layer: 'design' },
    { name: 'トランザクション・整合性の設計', hours: 60, layer: 'design' },
    { name: 'アーキテクチャ設計（モジュール分割）', hours: 100, layer: 'arch' },
    { name: '技術選定と全体設計の説明責任', hours: 100, layer: 'arch' },
  ],
};

/** 技術以外の能力（職種共通） */
export const SOFT_SKILLS: readonly SkillItem[] = [
  { name: '決められた手順を守って作業する', hours: 20, layer: 'routine' },
  { name: '報告・連絡・相談', hours: 20, layer: 'routine' },
  { name: '電話・メールでの対応', hours: 20, layer: 'ops' },
  { name: '作業記録・日報を残す', hours: 20, layer: 'ops' },
  { name: 'ドキュメント作成・仕様の言語化', hours: 30, layer: 'build' },
  { name: '要件のヒアリング', hours: 40, layer: 'design' },
  { name: '見積・工数の算出', hours: 40, layer: 'design' },
  { name: 'レビュー・後輩の指導', hours: 40, layer: 'design' },
  { name: '障害対応の指揮・報告', hours: 40, layer: 'design' },
  { name: '顧客・他部署との折衝', hours: 40, layer: 'design' },
  { name: 'チームマネジメント・進行管理', hours: 60, layer: 'arch' },
  { name: '技術的な意思決定の説明', hours: 60, layer: 'arch' },
  { name: '採用・面接', hours: 30, layer: 'arch' },
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

/** 1日あたりの学習時間の比較に使う刻み（結果タブの表） */
export const DAILY_STUDY_PATTERNS = [0.5, 1, 1.5, 2, 3] as const;
