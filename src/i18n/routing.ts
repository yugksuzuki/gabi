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
    // G2 e G3 da revisão de 27/08 (docs/08 §1): ela renomeou as duas abas.
    // "Quem sou eu" virou "A artista" — troca dela, dita em áudio — e "Textos"
    // virou "Ensaios". A rota acompanha o rótulo: trocar agora custa zero,
    // porque nada foi indexado; depois da estreia custaria redirecionamento
    // permanente. O caminho interno (a chave) muda junto com a pasta em
    // src/app/[locale]/, senão o next-intl não acha a página.
    // Só o lado português muda: ela renomeou as abas EM PORTUGUÊS. Os pares em
    // inglês continuam '/about' e '/writing', que docs/01 §1 registra como "já
    // estavam certos" — "About" e "Writing" são o que essas páginas se chamam
    // em inglês, e "A artista" não é um pedido de renomear a versão EN.
    '/a-artista': { pt: '/a-artista', en: '/about' },
    '/ensaios': { pt: '/ensaios', en: '/writing' },
    '/ensaios/[slug]': { pt: '/ensaios/[slug]', en: '/writing/[slug]' },
    '/contato': { pt: '/contato', en: '/contact' },
  },
})

export type CaminhoInterno = keyof typeof routing.pathnames
