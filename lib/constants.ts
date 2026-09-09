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
  { key: 'infraOnPrem', label: 'インフラエンジニア（オンプレ）' },
  { key: 'infraCloud', label: 'インフラエンジニア（クラウド）' },
  { key: 'devFront', label: '開発エンジニア（フロントエンド）' },
  { key: 'devBack', label: '開発エンジニア（バックエンド）' },
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
    key: 'ops',
    name: '運用・保守',
    maxRate: 55,
    summary: '手順書のある作業を、止めずに回す',
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
  ops: 0,
  build: 1,
  design: 2,
  arch: 3,
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
    { name: 'Linux の基本操作・シェル', hours: 20, layer: 'ops' },
    { name: 'ネットワーク基礎（TCP/IP・ルーティング）', hours: 40, layer: 'ops' },
    { name: 'サーバ機器・ラック構成の理解', hours: 20, layer: 'ops' },
    { name: '監視の設定と運用（Zabbix 等）', hours: 30, layer: 'ops' },
    { name: 'バックアップ・リストアの運用', hours: 20, layer: 'ops' },
    { name: '障害の切り分けと一次対応', hours: 30, layer: 'ops' },
    { name: '仮想化（VMware / KVM）', hours: 40, layer: 'build' },
    { name: 'ストレージ構成（RAID・SAN/NAS）', hours: 40, layer: 'build' },
    { name: 'ロードバランサ・冗長化構成', hours: 40, layer: 'build' },
    { name: 'ファイアウォール・VPN の構築', hours: 40, layer: 'build' },
    { name: 'Ansible による構成管理', hours: 40, layer: 'build' },
    { name: '容量・性能のサイジング', hours: 60, layer: 'design' },
    { name: '可用性設計（冗長化・DR）', hours: 60, layer: 'design' },
    { name: 'セキュリティ設計・監査対応', hours: 60, layer: 'design' },
    { name: 'ネットワーク設計（セグメント・経路）', hours: 60, layer: 'design' },
    { name: 'オンプレ↔クラウド移行の設計', hours: 100, layer: 'arch' },
    { name: '全体構成の技術選定と説明責任', hours: 100, layer: 'arch' },
  ],
  infraCloud: [
    { name: 'Linux の基本操作・シェル', hours: 20, layer: 'ops' },
    { name: 'AWS の基本サービス（EC2/S3/VPC/RDS）', hours: 60, layer: 'ops' },
    { name: 'IAM と権限管理の基本', hours: 30, layer: 'ops' },
    { name: '監視・ログ（CloudWatch）', hours: 30, layer: 'ops' },
    { name: 'コスト管理・請求の見方', hours: 20, layer: 'ops' },
    { name: 'Terraform による IaC', hours: 60, layer: 'build' },
    { name: 'コンテナ（Docker）', hours: 40, layer: 'build' },
    { name: 'CI/CD パイプラインの構築', hours: 40, layer: 'build' },
    { name: 'VPC・ネットワーク構成の構築', hours: 60, layer: 'build' },
    { name: 'Kubernetes（EKS / ECS）', hours: 100, layer: 'build' },
    { name: 'サーバーレス（Lambda・API Gateway）', hours: 40, layer: 'build' },
    { name: '可用性・DR 設計（マルチAZ／リージョン）', hours: 60, layer: 'design' },
    { name: 'セキュリティ設計（境界・暗号化・監査）', hours: 60, layer: 'design' },
    { name: 'コスト最適化の設計', hours: 40, layer: 'design' },
    { name: '監視・オブザーバビリティの設計', hours: 60, layer: 'design' },
    { name: 'マルチクラウド／移行アーキテクチャ', hours: 100, layer: 'arch' },
    { name: '生成AI基盤（Bedrock / SageMaker）の構築', hours: 100, layer: 'arch' },
    { name: '技術選定と全体設計の説明責任', hours: 100, layer: 'arch' },
  ],
  devFront: [
    { name: 'HTML / CSS の基本', hours: 20, layer: 'ops' },
    { name: 'JavaScript の基本', hours: 40, layer: 'ops' },
    { name: 'Git によるチーム開発', hours: 20, layer: 'ops' },
    { name: '既存画面の修正・バグ対応', hours: 20, layer: 'ops' },
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
    { name: 'プログラミング言語の基本（1つ）', hours: 40, layer: 'ops' },
    { name: 'SQL の基本', hours: 30, layer: 'ops' },
    { name: 'Git によるチーム開発', hours: 20, layer: 'ops' },
    { name: '既存機能の修正・バグ対応', hours: 20, layer: 'ops' },
    { name: 'Web フレームワーク（1つ）', hours: 60, layer: 'build' },
    { name: 'REST API の実装', hours: 40, layer: 'build' },
    { name: '認証・認可の実装', hours: 40, layer: 'build' },
    { name: 'テスト実装（単体・結合）', hours: 40, layer: 'build' },
    { name: '非同期処理・ジョブ管理', hours: 40, layer: 'build' },
    { name: 'Docker によるローカル環境構築', hours: 30, layer: 'build' },
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
  { name: 'ドキュメント作成・仕様の言語化', hours: 30, layer: 'build' },
  { name: '要件のヒアリング', hours: 40, layer: 'design' },
  { name: '見積・工数の算出', hours: 40, layer: 'design' },
  { name: 'コードレビュー・後輩の指導', hours: 40, layer: 'design' },
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
