import contato from './contato'
import { ehPendente, type Obra } from './obras'
import { localizar } from './localizar'
import { urlDoSite } from './url-do-site'
import { getPathname } from '@/i18n/navigation'
import type { Idioma } from '@/i18n/routing'

/**
 * Dados estruturados — itens 21 e 22 do Stack Técnico, docs/03 §7.
 *
 * Para arte isto não é detalhe de SEO: é o que faz uma obra aparecer no Google
 * Imagens com nome, autora e técnica em vez de "imagem sem título", e é o que
 * habilita painel de conhecimento para a Gabriela. docs/01 §6 registra o Google
 * Imagens como caminho real de descoberta neste projeto.
 *
 * A regra 2 do CLAUDE.md vale aqui com força extra. Dado estruturado é lido por
 * máquina e sai do nosso controle: um `artMedium` inventado vira ficha técnica
 * errada num painel do Google, e depois é difícil de desfazer. Por isso TODO
 * campo pendente é OMITIDO, nunca preenchido com plausível, nunca com string
 * vazia — o schema.org trata ausência bem e adivinhação mal.
 */

type Json = Record<string, unknown>

/** Descarta chave sem valor. É o que mantém a promessa de não inventar campo. */
function limpar(objeto: Json): Json {
  return Object.fromEntries(
    Object.entries(objeto).filter(([, v]) => {
      if (v == null) return false
      if (Array.isArray(v)) return v.length > 0
      return true
    })
  )
}

const urlAbsoluta = (caminho: string) => `${urlDoSite()}${caminho}`

/**
 * A autora. Person, não Artist — o schema.org não tem tipo "artista plástico",
 * e mais: a regra 1 deste projeto é que o site NÃO a intitula. `Person` com
 * `sameAs` diz quem ela é sem rotular, que é exatamente o que ela pediu.
 *
 * `jobTitle` fica de fora de propósito. Seria o lugar óbvio de escrever
 * "artista plástica" e é justamente o que não se faz aqui.
 */
export function pessoa(locale: Idioma): Json {
  return limpar({
    '@type': 'Person',
    '@id': `${urlDoSite()}#gabriela-seleme`,
    name: 'Gabriela Seleme',
    url: urlAbsoluta(getPathname({ href: '/', locale })),
    email: `mailto:${contato.email}`,
    sameAs: [contato.instagramUrl],
  })
}

/** cm é a unidade das fichas dela. QuantitativeValue exige a unidade explícita. */
function medida(valor: number | undefined, unidade: string): Json | null {
  if (valor == null) return null
  return {
    '@type': 'QuantitativeValue',
    value: valor,
    unitText: unidade,
  }
}

/**
 * VisualArtwork da obra.
 *
 * `offers` só entra quando existe preço E disponibilidade — e mesmo assim como
 * informação, nunca com `url` de compra ou qualquer sinal de checkout
 * (docs/03 §7 e regra 3). Peça única se negocia por conversa; um snippet de
 * produto no Google puxaria o posicionamento para loja, que é o dano que a
 * regra 3 existe para impedir.
 */
export function obraEmSchema(obra: Obra, locale: Idioma): Json {
  const caminho = urlAbsoluta(
    getPathname({ href: { pathname: '/obras/[slug]', params: { slug: obra.slug } }, locale })
  )

  // `ehPendente` é boolean puro de propósito (ver src/lib/obras.ts), então a
  // ficha vem como `string | objeto`. Descartar a string é o que sobra sendo
  // dimensão de verdade.
  const dimensoes = typeof obra.dimensoes === 'object' ? obra.dimensoes : null
  const unidade = dimensoes?.unidade ?? 'cm'

  const imagens = obra.imagens
    .filter((im) => localizar(im.alt, locale))
    .map((im) => urlAbsoluta(im.src))

  const disponivel =
    !ehPendente(obra.disponibilidade) && obra.disponibilidade === 'disponivel'

  return limpar({
    '@type': 'VisualArtwork',
    '@id': `${caminho}#obra`,
    name: obra.titulo,
    url: caminho,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
    creator: { '@id': `${urlDoSite()}#gabriela-seleme` },
    dateCreated: ehPendente(obra.ano) ? null : String(obra.ano),
    // `artMedium` é o material; `artform` seria a forma (pintura, escultura,
    // relevo) e fica FORA: a ficha dela diz a técnica, não a forma, e escolher
    // uma seria classificar o trabalho no lugar dela — a mesma regra 1 que
    // proíbe o site de intitulá-la.
    artMedium: localizar(obra.materiais, locale) ?? localizar(obra.tecnica, locale),
    abstract: localizar(obra.legenda, locale),
    width: medida(dimensoes?.largura, unidade),
    height: medida(dimensoes?.altura, unidade),
    depth: medida(dimensoes?.profundidade, unidade),
    image: imagens,
    // Preço informativo. Sem `url` de compra, sem `seller`, sem `checkout`:
    // o caminho continua sendo a conversa.
    offers:
      obra.precoBRL && disponivel
        ? {
            '@type': 'Offer',
            price: obra.precoBRL,
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            availableAtOrFrom: { '@id': `${urlDoSite()}#gabriela-seleme` },
          }
        : null,
  })
}

/**
 * Migalhas de pão da página de obra. Duas hastes: o portfólio (que é a home) e
 * a obra. Não existe nível intermediário porque não existe categoria — o
 * acervo é um só.
 */
export function migalhas(obra: Obra, locale: Idioma, rotuloPortfolio: string): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: rotuloPortfolio,
        item: urlAbsoluta(getPathname({ href: '/', locale })),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: obra.titulo,
        item: urlAbsoluta(
          getPathname({
            href: { pathname: '/obras/[slug]', params: { slug: obra.slug } },
            locale,
          })
        ),
      },
    ],
  }
}

/** Empacota num único `@graph`: um bloco por página, não três soltos. */
export function grafo(...nos: Json[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nos })
}
