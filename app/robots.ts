import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Netlify preview URLs must never be indexed
  if (process.env.CONTEXT && process.env.CONTEXT !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/','/admin/'] },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}