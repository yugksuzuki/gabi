import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/**
 * Cabeçalhos de segurança — o padrão Cuoncient para todo site publicado
 * (docs/11 §2). Nenhum deles muda o que a página mostra; todos fecham uma
 * porta que o site não usa:
 *
 * - quadro: ninguém embute o site num <iframe> alheio. Um site de obra única
 *   embutido em página de terceiro é o primeiro passo de golpe com o nome dela.
 *   O wireframe também não é embutido em lugar nenhum — conferido em
 *   public/wireframe/, que só tem links.
 * - CSP só de moldura: `frame-ancestors` é a versão moderna do X-Frame-Options;
 *   `base-uri` e `object-src` fecham injeção de <base> e de plugin. Nada de
 *   `script-src` aqui: o Next injeta script inline, e uma CSP de script mal
 *   calibrada quebra a hidratação sem aviso. Fica para quando houver nonce.
 * - HSTS sem `preload` e sem `includeSubDomains`: o domínio definitivo ainda
 *   está em aberto (CLAUDE.md). Preload é compromisso que não se desfaz em
 *   semanas, e não se assume isso pelo domínio de outra pessoa.
 * - Permissions-Policy: câmera, microfone e localização desligados. O site não
 *   pede nenhum dos três, e assim nenhum script de terceiro pode pedir.
 */
const SEGURANCA = [
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  // "X-Powered-By: Next.js" não ajuda quem visita e entrega a stack de graça
  // para quem procura versão vulnerável.
  poweredByHeader: false,
  // O `next dev` escreve um bloco de instruções para agentes dentro do
  // CLAUDE.md. Este CLAUDE.md é a memória do projeto, escrita à mão e revisada
  // com a cliente por perto; um bloco reescrito a cada `pnpm dev` vira ruído
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

    const indexacao = aberto
      ? [{ source: '/wireframe/:path*', headers: [fechar] }]
      : [{ source: '/:path*', headers: [fechar] }]

    // Segurança vale nos dois estados da chave e em toda rota, inclusive
    // /wireframe/ e os PNG de /og e /story.
    return [{ source: '/:path*', headers: SEGURANCA }, ...indexacao]
  },
}

export default withNextIntl(nextConfig)
