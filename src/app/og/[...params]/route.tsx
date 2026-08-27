import { ImageResponse } from 'next/og'
import {
  TAMANHO_OG,
  cartaoDeObra,
  cartaoDePagina,
  fontesDoCartao,
} from '@/lib/og'
import { ehPendente, lerObras } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { campo, textosVisiveis } from '@/lib/textos'
import { idiomas, type Idioma } from '@/i18n/routing'
import pt from '@/messages/pt.json'
import en from '@/messages/en.json'

/**
 * Cartões sociais, um por página e por idioma — item 24 do Stack Técnico.
 *
 * `/og/pt/obra/encontro.png` · `/og/en/pagina/sobre.png`
 *
 * O `.png` no fim não é enfeite: o matcher do src/proxy.ts ignora caminho com
 * extensão, e é isso que impede o middleware de i18n de tentar prefixar estas
 * rotas com um idioma (`/pt/og/...`) e quebrá-las.
 *
 * `dynamicParams = false` + generateStaticParams: TUDO é gerado no build. Em
 * produção estes arquivos são estáticos — nenhuma função roda quando alguém
 * cola o link no WhatsApp, e o cartão aparece na hora, que é o único jeito de
 * ele aparecer (rede social desiste rápido de preview que demora).
 */

export const dynamicParams = false

const MENSAGENS: Record<Idioma, typeof pt> = { pt, en: en as typeof pt }

/** As páginas fixas que ganham cartão, e de onde sai o texto de cada uma. */
const PAGINAS = ['portfolio', 'sobre', 'textos', 'contato'] as const
type Pagina = (typeof PAGINAS)[number]

export function generateStaticParams() {
  const obras = lerObras()
  return idiomas.flatMap((idioma) => [
    ...PAGINAS.map((pagina) => ({ params: [idioma, 'pagina', `${pagina}.png`] })),
    ...obras.map((obra) => ({ params: [idioma, 'obra', `${obra.slug}.png`] })),
    ...textosVisiveis().map((texto) => ({ params: [idioma, 'texto', `${texto.slug}.png`] })),
  ])
}

function responder(elemento: React.ReactElement) {
  return new ImageResponse(elemento, { ...TAMANHO_OG, fonts: fontesDoCartao() })
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
  const chave = arquivo.slice(0, -'.png'.length)
  const m = MENSAGENS[lang]

  if (tipo === 'obra') {
    const obra = lerObras().find((o) => o.slug === chave)
    if (!obra) return new Response('Não encontrado', { status: 404 })

    // A imagem do cartão é a MESMA que representa a obra na sequência da home:
    // a `principal`. Sem ela, o cartão é tipográfico — nunca uma foto de
    // detalhe fazendo as vezes da obra inteira.
    const principal = obra.imagens.find((i) => i.papel === 'principal')

    return responder(
      cartaoDeObra({
        titulo: obra.titulo,
        ano: ehPendente(obra.ano) ? null : String(obra.ano),
        tecnica: localizar(obra.tecnica, lang),
        imagem: principal?.src ?? null,
      })
    )
  }

  if (tipo === 'texto') {
    const texto = textosVisiveis().find((t) => t.slug === chave)
    if (!texto) return new Response('Não encontrado', { status: 404 })
    return responder(
      cartaoDePagina(campo(texto.titulo, lang), campo(texto.resumo, lang))
    )
  }

  if (tipo === 'pagina' && (PAGINAS as readonly string[]).includes(chave)) {
    const pagina = chave as Pagina
    // O portfólio é a home: o cartão dela é o do site inteiro, e por isso leva
    // a descrição padrão em vez do rótulo da aba.
    const titulo = pagina === 'portfolio' ? m.meta.tituloPadrao : m[pagina].titulo
    const subtitulo = pagina === 'portfolio' ? m.meta.descricaoPadrao : null

    return responder(cartaoDePagina(titulo, subtitulo))
  }

  return new Response('Não encontrado', { status: 404 })
}
