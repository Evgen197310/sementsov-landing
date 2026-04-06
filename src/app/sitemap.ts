import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sementsov.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    team,
    servicesInd,
    servicesLegal,
    newsArticles,
    pressArticles,
    practiceCategories,
    publications,
    documents,
  ] = await Promise.all([
    prisma.teamMember.findMany({ select: { slug: true } }),
    prisma.service.findMany({
      where: { category: { slug: "individuals" } },
      select: { slug: true },
    }),
    prisma.service.findMany({
      where: { category: { slug: "legal" } },
      select: { slug: true },
    }),
    prisma.newsArticle.findMany({
      where: { section: "news" },
      select: { slug: true, createdAt: true },
    }),
    prisma.mediaArticle.findMany({
      select: { slug: true, createdAt: true },
    }),
    prisma.practiceCategory.findMany({ select: { slug: true } }),
    prisma.publication.findMany({ select: { slug: true, createdAt: true } }),
    prisma.document.findMany({ select: { slug: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/team`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contacts`, changeFrequency: "monthly", priority: 0.7 },

    { url: `${SITE_URL}/services/individuals`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/legal`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/mediation`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/media/news`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/media/press`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/media/legislation`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/media/publications`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/practice`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/documents`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/career`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/social`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const teamPages: MetadataRoute.Sitemap = team.map((m) => ({
    url: `${SITE_URL}/team/${m.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceIndPages: MetadataRoute.Sitemap = servicesInd.map((s) => ({
    url: `${SITE_URL}/services/individuals/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceLegalPages: MetadataRoute.Sitemap = servicesLegal.map((s) => ({
    url: `${SITE_URL}/services/legal/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newsPages: MetadataRoute.Sitemap = newsArticles.map((a) => ({
    url: `${SITE_URL}/media/news/${a.slug}`,
    lastModified: a.createdAt,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const pressPages: MetadataRoute.Sitemap = pressArticles.map((a) => ({
    url: `${SITE_URL}/media/press/article/${a.slug}`,
    lastModified: a.createdAt,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const practicePages: MetadataRoute.Sitemap = practiceCategories.map((c) => ({
    url: `${SITE_URL}/practice/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const publicationPages: MetadataRoute.Sitemap = publications.map((p) => ({
    url: `${SITE_URL}/media/publications/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const documentPages: MetadataRoute.Sitemap = documents.map((d) => ({
    url: `${SITE_URL}/documents/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...teamPages,
    ...serviceIndPages,
    ...serviceLegalPages,
    ...newsPages,
    ...pressPages,
    ...practicePages,
    ...publicationPages,
    ...documentPages,
  ];
}
