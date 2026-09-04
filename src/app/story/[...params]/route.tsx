import { ImageResponse } from 'next/og'
import { TAMANHO_STORY, cartaoDeStory, fontesDoCartao } from '@/lib/og'
import { lerObras } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { campo, textosVisiveis } from '@/lib/textos'
import { idiomas, type Idioma } from '@/i18n/routing'
import pt from '@/messages/pt.json'
import en from '@/messages/en.json'

/**
 * O card de story — 1080×1920, o pedido dela de 30/07/26.
 *
 * `/story/pt/texto/<slug>.png` · `/story/en/obra/encontro.png`
 *
 * Ela escreveu que queria compartilhar "um trecho de texto do site para o
 * story, de forma bonita, com link de volta". Isto é site → Instagram, e é
 * barato. NÃO confundir com o Diário de Ateliê, que é o caminho inverso
 * (Instagram → site), depende de app aprovado pela Meta e é outro projeto —
 * CLAUDE.md separa os dois de propósito porque hoje vivem misturados sob o
 * rótulo "automação".
 *
 * O trecho é sempre conteúdo DELA: o resumo do texto, ou a legenda da obra.
 * Nunca um recorte automático do corpo — cortar frase de artista no meio é
 * reescrever, e a regra 2 não permite.
 *
 * Pré-gerado no build como os cartões sociais. `.png` no fim pelo mesmo motivo:
 * é o que faz o middleware de i18n deixar a rota em paz.
 */

export const dynamicParams = false

const MENSAGENS: Record<Idioma, typeof pt> = { pt, en: en as typeof pt }

export function generateStaticParams() {
  return idiomas.flatMap((idioma) => [
    ...lerObras()
      .filter((obra) => localizar(obra.legenda, idioma))
      .map((obra) => ({ params: [idioma, 'obra', `${obra.slug}.png`] })),
    ...textosVisiveis().map((texto) => ({ params: [idioma, 'texto', `${texto.slug}.png`] })),
  ])
}

export async function GET(
  _requisicao: Request,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const { params: partes } = await params
  const [idioma, tipo, arquivo] = partes

  if (!idiomas.includes(idioma as Idioma) || !arquivo?.endsWith('.png')) {
    return new Response('Não encontrado', { status: 404 })
  }

  const lang = idioma as Idioma
  const slug = arquivo.slice(0, -'.png'.length)
  const m = MENSAGENS[lang]

  if (tipo === 'texto') {
    const texto = textosVisiveis().find((t) => t.slug === slug)
    if (!texto) return new Response('Não encontrado', { status: 404 })

    return new ImageResponse(
      cartaoDeStory({
        trecho: campo(texto.resumo, lang),
        origem: campo(texto.titulo, lang),
        rotuloOrigem: m.textos.titulo,
      }),
      { ...TAMANHO_STORY, fonts: fontesDoCartao() }
    )
  }

  if (tipo === 'obra') {
    const obra = lerObras().find((o) => o.slug === slug)
    const legenda = obra ? localizar(obra.legenda, lang) : null
    // Sem legenda aprovada não existe trecho. Melhor não gerar o card do que
    // gerar um com a marca [PENDENTE] indo parar num story.
    if (!obra || !legenda) return new Response('Não encontrado', { status: 404 })

    return new ImageResponse(
      cartaoDeStory({
        trecho: legenda,
        origem: obra.titulo,
        rotuloOrigem: m.portfolio.titulo,
      }),
      { ...TAMANHO_STORY, fonts: fontesDoCartao() }
    )
  }

  return new Response('Não encontrado', { status: 404 })
}
