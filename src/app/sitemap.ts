import type { MetadataRoute } from "next";
import { tools } from "@/features/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolhub.app";

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...toolPages,
  ];
}