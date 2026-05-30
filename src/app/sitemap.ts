import type { MetadataRoute } from "next";
import prisma from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://traceon.click2pdf.in";

  // Define static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blockchain`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // Fetch all diamonds from the database to generate dynamic sitemap entries
    const diamonds = await prisma.diamond.findMany({
      select: {
        roughId: true,
        updatedAt: true,
      },
    });

    const dynamicRoutes: MetadataRoute.Sitemap = diamonds.map((diamond) => ({
      url: `${baseUrl}/diamond/${diamond.roughId}`,
      lastModified: diamond.updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap, returning static only:", error);
    return staticRoutes;
  }
}
