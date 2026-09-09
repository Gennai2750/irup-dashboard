import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '単価とスキルの棚卸しダッシュボード',
  description: '職種・単価・保有技術から、目標単価に到達する時期を試算する画面',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* 明朝体（見出し）／ゴシック体（本文）／等幅（数字）を Google Fonts から読み込む */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
