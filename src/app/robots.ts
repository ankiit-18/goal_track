import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/dashboard/",
          "/goals",
          "/goals/",
          "/profile",
          "/profile/",
          "/login",
          "/register",
          "/verify-email",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
