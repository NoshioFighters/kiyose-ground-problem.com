import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { GaPageViewTracker } from "@/components/ga-page-view-tracker";
import {
  seoDescription,
  seoOgDescription,
  seoOgImageHeight,
  seoOgImagePath,
  seoOgImageWidth,
  seoOgTitle,
  seoSiteName,
  seoTitle,
} from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  adjustFontFallback: true,
});

const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() ||
  "";

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: seoTitle,
  description: seoDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seoOgTitle,
    description: seoOgDescription,
    url: "/",
    siteName: seoSiteName,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: seoOgImagePath,
        width: seoOgImageWidth,
        height: seoOgImageHeight,
        alt: seoOgTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoOgTitle,
    description: seoOgDescription,
    images: [seoOgImagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <head>
        {gaMeasurementId ? (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-tag-gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body
        className={`flex min-h-screen w-full min-w-0 flex-col bg-white text-body antialiased ${notoSansJp.className}`}
      >
        <SiteJsonLd />
        {children}
        {gaMeasurementId ? (
          <GaPageViewTracker gaId={gaMeasurementId} />
        ) : null}
      </body>
    </html>
  );
}
