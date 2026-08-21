import { defineRouting } from 'next-intl/routing'

export const idiomas = ['pt', 'en'] as const
export type Idioma = (typeof idiomas)[number]

/**
 * Rotas explícitas nos dois idiomas — docs/03-modelo-de-dados.md §4.
 *
 * A chave é o caminho interno (o nome da pasta em src/app/[locale]); o valor é o
 * que aparece na barra de endereço. O slug da obra é o MESMO nos dois idiomas,
 * porque o nome da peça não traduz: só o segmento de seção muda.
 */
export const routing = defineRouting({
  locales: idiomas,
  defaultLocale: 'pt',
  // Sempre com prefixo: `/` redireciona por Accept-Language e nunca é canônica.
  localePrefix: 'always',
  localeDetection: true,
  pathnames: {
    '/': '/',
    '/obras/[slug]': { pt: '/obras/[slug]', en: '/works/[slug]' },
    '/sobre': { pt: '/sobre', en: '/about' },
    '/textos': { pt: '/textos', en: '/writing' },
    '/textos/[slug]': { pt: '/textos/[slug]', en: '/writing/[slug]' },
    '/contato': { pt: '/contato', en: '/contact' },
  },
})

export type CaminhoInterno = keyof typeof routing.pathnames
