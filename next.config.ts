import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    // docs/01 §2 item 15 — AVIF e WebP.
    formats: ['image/avif', 'image/webp'],
  },
  // O conteúdo real ainda não existe. Enquanto houver [PENDENTE] em rota
  // publicada, nada é indexado — ver docs/01 §7.7.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
