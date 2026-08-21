import { getPathname } from '@/i18n/navigation'
import { routing, idiomas } from '@/i18n/routing'
import { urlDoSite } from './url-do-site'

export { urlDoSite }

/**
 * Canônica por idioma + hreflang recíproco + x-default apontando para PT
 * (itens 06 e 25 do Stack Técnico; docs/03 §4).
 *
 * NEXT_PUBLIC_SITE_URL é o que faz canônica e Open Graph existirem de verdade.
 * O domínio definitivo ainda está EM ABERTO: ela comprou gclm.com.br mas os
 * contatos são @gseleme.design, e ninguém amarrou as pontas (CLAUDE.md).
 * Enquanto isso, a URL vem do ambiente — nunca fixa no código.
 */
/**
 * O próprio tipo do next-intl: rota sem parâmetro é string literal, rota com
 * parâmetro exige `params` com as chaves certas. Reaproveitar o tipo em vez de
 * redeclarar é o que faz um slug errado virar erro de build, não 404 silencioso.
 */
type Href = Parameters<typeof getPathname>[0]['href']

export function alternativas(href: Href, locale: string) {
  const base = urlDoSite()
  const caminho = (idioma: (typeof idiomas)[number]) =>
    base + getPathname({ href, locale: idioma })

  return {
    canonical: caminho(locale as (typeof idiomas)[number]),
    languages: {
      ...Object.fromEntries(idiomas.map((idioma) => [idioma, caminho(idioma)])),
      // x-default aponta para PT, o padrão do site.
      'x-default': caminho(routing.defaultLocale),
    },
  }
}
