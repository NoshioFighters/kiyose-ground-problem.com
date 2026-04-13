import {
  seoDescription,
  seoOgTitle,
  seoSiteName,
} from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site";

export function SiteJsonLd() {
  const origin = getSiteOrigin();
  const url = `${origin}/`;

  const graph = [
    {
      "@type": "WebSite" as const,
      "@id": `${url}#website`,
      name: seoSiteName,
      url,
      description: seoDescription,
      inLanguage: "ja-JP",
      publisher: { "@id": `${url}#organization` },
    },
    {
      "@type": "Organization" as const,
      "@id": `${url}#organization`,
      name: seoSiteName,
      url,
    },
    {
      "@type": "WebPage" as const,
      "@id": `${url}#webpage`,
      url,
      name: seoOgTitle,
      description: seoDescription,
      isPartOf: { "@id": `${url}#website` },
      inLanguage: "ja-JP",
    },
  ];

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD の標準的な埋め込み
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
