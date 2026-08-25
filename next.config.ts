import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // O `next dev` escreve um bloco de instruções para agentes dentro do
  // CLAUDE.md. Este CLAUDE.md é a memória do projeto, escrita à mão e revisada
  // com a cliente por perto; um bloco reescrito a cada `npm run dev` vira ruído
  // no diff e, pior, sugere que o arquivo é gerado. Desligado.
  agentRules: false,
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
