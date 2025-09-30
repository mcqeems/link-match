import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const now = new Date();
  const pages = ['', '/about', '/contact', '/sign-in', '/sign-up', '/talents', '/profile'];

  return pages.map((p) => ({
    url: `${baseUrl}${p || '/'}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));
}
