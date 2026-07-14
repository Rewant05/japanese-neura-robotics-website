import type { MetadataRoute } from "next";
import { navItems, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const utilityRoutes = ["/privacy-policy", "/terms-of-use"];

  return [...navItems.map((item) => item.href), ...utilityRoutes].map(
    (route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : 0.75,
    }),
  );
}
