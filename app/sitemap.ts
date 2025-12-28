import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://artmasons.com';
  
  // Static routes
  const staticRoutes = [
    '',
    '/about-us',
    '/artworks',
    '/artists-a-z',
    '/top-100',
    '/cart',
    '/checkout',
    '/delivery-information',
    '/faqs',
    '/frame-size-art',
    '/our-quality',
    '/privacy-policy',
    '/return-policy',
    '/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return staticRoutes;
}
