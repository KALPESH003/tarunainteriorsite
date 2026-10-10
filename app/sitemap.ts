import type { MetadataRoute } from 'next';
import { ARCHIVE, IN_PROGRESS } from '@/data/projects';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // add /contact, /about, /services ONLY if those routes really exist
  ];

  const seen = new Set<string>();
  const projectPages: MetadataRoute.Sitemap = [...ARCHIVE, ...IN_PROGRESS]
    .filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)))
    .map((p) => ({
      url: `${SITE.url}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    }));

  return [...staticPages, ...projectPages];
}