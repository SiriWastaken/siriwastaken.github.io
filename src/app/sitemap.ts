import type { MetadataRoute } from "next";
import { getProjectsWithDetails } from "@/data/projects";
import { getSiteUrl } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: new URL("/", base).toString(), changeFrequency: "monthly", priority: 1 },
    ...getProjectsWithDetails().map((project) => ({
      url: new URL(`/projects/${project.slug}/`, base).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
