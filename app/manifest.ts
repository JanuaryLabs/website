import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'January',
    short_name: 'January',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    description:
      'January is next generation backend experience for developers.',
    dir: 'ltr',
    start_url: '/',
    orientation: 'portrait',
    icons: [
      {
        src: '/static/logos/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/static/logos/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

export const dynamic = 'force-static';
