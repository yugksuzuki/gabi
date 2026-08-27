import type { Metadata } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing, idiomas, type Idioma } from '@/i18n/routing'
import { altDoCartao, TAMANHO_OG } from './og'
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

/**
 * Open Graph e Twitter Card — item 24 do Stack Técnico.
 *
 * Um só lugar decide o formato do cartão, porque a alternativa é cada página
 * montar o dela e uma delas esquecer o `alt`, ou o `type`, ou a URL absoluta.
 * O cartão em si é desenhado em src/lib/og.tsx e gerado em /og/... no build.
 *
 * `url` absoluta: o Facebook, o WhatsApp e o Instagram não resolvem caminho
 * relativo. metadataBase resolve o resto, mas a imagem é o que mais custa
 * quando falha — é ela que aparece.
 */
export function cartaoSocial({
  cartao,
  titulo,
  descricao,
  locale,
}: {
  /** Caminho do cartão gerado, sem o /og inicial. Ex.: 'obra/encontro'. */
  cartao: string
  titulo: string
  descricao?: string | null
  locale: Idioma
}): Metadata {
  const url = `${urlDoSite()}/og/${locale}/${cartao}.png`
  const imagem = {
    url,
    width: TAMANHO_OG.width,
    height: TAMANHO_OG.height,
    // Fallback explícito: quem chama já deveria ter validado o idioma, mas um
    // cartão sem `alt` é falha de acessibilidade e um cartão que DERRUBA a
    // página é bem pior. Nenhum dos dois vale um metadado.
    alt: (altDoCartao[locale] ?? altDoCartao.pt)(titulo),
  }

  return {
    openGraph: {
      type: 'website',
      siteName: 'Gabriela Seleme',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      title: titulo,
      ...(descricao ? { description: descricao } : {}),
      images: [imagem],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      ...(descricao ? { description: descricao } : {}),
      images: [imagem],
    },
  }
}

/**
 * Indexação, decidida por página.
 *
 * A trava global é `ABRIR_INDEXACAO=1` no ambiente de produção. Ela existe
 * porque `docs/01 §7.7` é categórico: *"site indexado com [PENDENTE] é dano
 * difícil de reverter"* — o buscador guarda o que viu, e um resultado de busca
 * mostrando "PENDENTE: TÉCNICA" no lugar da ficha fica meses no ar.
 *
 * Mas trava só global é grosseira demais para este acervo. Encontro está
 * completa e as outras duas não têm uma única fotografia; esperar as três para
 * abrir qualquer uma significa manter o site inteiro fora do índice por causa
 * de material que talvez demore meses.
 *
 * Então são DUAS condições, e as duas precisam valer:
 *
 *   1. `ABRIR_INDEXACAO=1` — a decisão humana de estrear
 *   2. a página não mostrar `[PENDENTE]` a quem chega. Para obra, isso é
 *      `estado: publicada` — a mesma condição que o sitemap já usa, e que o
 *      build só aceita quando a ficha está completa
 *
 * O efeito prático é que a chave pode ser virada HOJE sem constrangimento: a
 * obra que ainda tem pendência se recusa a ser indexada sozinha, e passa a ser
 * indexada no dia em que a ficha fechar. Ninguém precisa lembrar de voltar aqui.
 */
export function indexacaoAberta(): boolean {
  return process.env.ABRIR_INDEXACAO === '1'
}

export function robotsDaPagina({ temPendencia = false } = {}): Metadata['robots'] {
  const indexar = indexacaoAberta() && !temPendencia
  // `follow` acompanha o índice: página fechada que ainda distribui autoridade
  // para as outras é pedir para o buscador rastrear o que mandamos ignorar.
  return { index: indexar, follow: indexar }
}
