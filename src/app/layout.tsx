import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification = process.env.BING_SITE_VERIFICATION?.trim();
const yandexSiteVerification = process.env.YANDEX_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: "GoalTrack - Long-term goals and weekly progress",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "goal tracker",
    "long-term goals",
    "weekly goals",
    "milestones",
    "habit tracking",
    "productivity",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: "GoalTrack - Long-term goals and weekly progress",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GoalTrack - Long-term goals and weekly progress",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoalTrack - Long-term goals and weekly progress",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
    ...(bingSiteVerification ? { bing: bingSiteVerification } : {}),
    ...(yandexSiteVerification ? { yandex: yandexSiteVerification } : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body
        className={`${geistSans.className} min-h-full flex flex-col text-zinc-900 dark:text-zinc-100`}
      >
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
