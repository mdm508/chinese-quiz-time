import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "近義詞練習簿｜臺灣華語互動測驗",
  description: "用情境句、注音與英文詞義，練習臺灣華語近義詞的自然用法。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body>{children}</body>
    </html>
  );
}
