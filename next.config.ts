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
  //
  // Este cabeçalho é a trava mais grossa que existe: chega em toda resposta e
  // vence qualquer `robots` de página. Por isso ele tem de respeitar a mesma
  // chave que o resto — enquanto ele era fixo, ligar ABRIR_INDEXACAO não abria
  // nada, e a chave era decorativa. Ligada a chave, quem decide passa a ser
  // `robotsDaPagina()`, que mantém fora do índice a obra que ainda tem
  // [PENDENTE]. `/wireframe/` é noindex nos dois estados: são as pranchas do
  // desenho, não o site.
  async headers() {
    const aberto = process.env.ABRIR_INDEXACAO === '1'
    const fechar = { key: 'X-Robots-Tag', value: 'noindex, nofollow' }

    return aberto
      ? [{ source: '/wireframe/:path*', headers: [fechar] }]
      : [{ source: '/:path*', headers: [fechar] }]
  },
}

export default withNextIntl(nextConfig)
