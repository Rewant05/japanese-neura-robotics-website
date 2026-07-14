import type { Metadata, Viewport } from "next";
import { FuturisticNav } from "@/components/navigation/futuristic-nav";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} / ${site.jpName}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} / ${site.jpName}`,
    description: site.description,
    type: "website",
    url: site.url,
    images: [
      {
        url: "/images/neura-lab-poster.png",
        width: 1600,
        height: 900,
        alt: "未来的な日本のロボティクス研究室に立つ人型ロボット。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/neura-lab-poster.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050607",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <FuturisticNav />
        {children}
      </body>
    </html>
  );
}
