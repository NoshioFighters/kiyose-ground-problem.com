import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "清瀬の子どもたちから野球を奪わないで | 清瀬市グランド問題",
  description:
    "清瀬市教育委員会の対外試合禁止・駐車1台制限への抗議と周知。署名・要望書提出後も回答なし。子どもたちの野球を守るための情報発信サイトです。",
  openGraph: {
    title: "清瀬の子どもたちから野球を奪わないで",
    description:
      "7チーム・1,000名超の子どもたちの活動が危機に瀕しています。問題の周知と声を上げるためのサイトです。",
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
      <body className={`min-h-screen bg-white font-sans ${notoSansJp.className}`}>
        {children}
      </body>
    </html>
  );
}
