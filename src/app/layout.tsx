import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "吵架包赢 - AI智能反驳助手",
  description: "用AI帮你生成完美的反驳回复，让你在任何争论中都能占据上风！",
  keywords: "吵架,反驳,AI助手,智能回复,辩论",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
