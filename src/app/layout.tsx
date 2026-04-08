import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "清瀬の子どもたちに野球を続けさせてあげたい | 清瀬市グランド問題",
  description:
    "2026年2月の通達による対外試合の制限と駐車1台制限について、市民の理解と対話を求めて情報を発信しています。1,042名の署名と要望書提出後、回答を待っています。",
  openGraph: {
    title: "清瀬の子どもたちに、野球を続けさせてあげたい。",
    description:
      "7チーム・団体、1,042名の声。子どもたちのスポーツ環境を一緒に考えてください。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body
        className={`flex min-h-screen w-full min-w-0 flex-col bg-white text-body antialiased ${notoSansJp.className}`}
      >
        {children}
      </body>
    </html>
  );
}
