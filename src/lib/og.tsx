import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactElement } from 'react'
import contato from './contato'
import { dadosDaImagem } from './obras'
import { urlDoSite } from './url-do-site'
import type { Idioma } from '@/i18n/routing'

/**
 * O cartão social — item 24 do Stack Técnico.
 *
 * Por que isto existe e não é enfeite: docs/01 §6 diz, sobre a página de obra,
 * que "o link vai circular no Instagram e no WhatsApp; o card é o primeiro
 * contato". Site e Instagram sobem no mesmo dia, e a maior parte do tráfego vem
 * de lá. Sem cartão, o WhatsApp inventa um: pega a primeira imagem que achar,
 * corta como quiser, e a obra estreia recortada.
 *
 * O desenho segue a mesma regra da página: fundo branco osso, a obra INTEIRA
 * (contain, nunca corte), tipografia de catálogo e nada mais. Nada de selo,
 * nada de "clique aqui", nada de preço — cartão social não é vitrine.
 *
 * Tudo é pré-gerado no build (a rota tem dynamicParams = false). Nenhuma
 * requisição em produção, nenhum custo por link compartilhado.
 */

export const TAMANHO_OG = { width: 1200, height: 630 }

/** Story do Instagram. 9:16, e é o formato que ela pediu por escrito. */
export const TAMANHO_STORY = { width: 1080, height: 1920 }

/** Os mesmos tokens de src/styles/tokens.css. Satori não lê CSS custom properties. */
const COR = {
  bg: '#f4f2ee',
  bgAlt: '#eae7e1',
  ink: '#1a1917',
  inkMuted: '#635f58',
  line: '#dcd8d1',
} as const

/**
 * Duas portas de leitura, cada uma presa a uma pasta.
 *
 * O Turbopack analisa o argumento do readFileSync para decidir quais arquivos
 * precisam viajar junto com a função. Com um caminho totalmente variável ele
 * desiste e reboca o projeto inteiro — inclusive todo o public/ — para dentro do
 * pacote do servidor. Prender a pasta no literal e deixar variável só o nome do
 * arquivo é o que mantém o rastreamento preciso.
 */
const PASTA_FONTES = 'src/styles/fontes/og'
const FONTE_FRAUNCES = 'fraunces-og.ttf'
const FONTE_INTER = 'inter-og.ttf'

function arquivoDeFonte(nome: string): Buffer {
  return readFileSync(join(process.cwd(), PASTA_FONTES, nome))
}

function arquivoPublico(src: string): Buffer {
  return readFileSync(join(process.cwd(), 'public', src))
}

/**
 * Fontes em TTF instanciado e subsetado (latim + pontuação), porque o Satori
 * não lê woff2 nem eixo variável. São 74 KB que NUNCA vão para o navegador:
 * só o build as usa. Geradas por scripts/gerar-fontes-og.py a partir dos
 * mesmos arquivos que o site serve — mesma fonte, mesmo desenho.
 */
export function fontesDoCartao() {
  return [
    {
      name: 'Fraunces',
      data: arquivoDeFonte(FONTE_FRAUNCES),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Inter',
      data: arquivoDeFonte(FONTE_INTER),
      weight: 400 as const,
      style: 'normal' as const,
    },
  ]
}

/**
 * A foto entra como data URI lida do disco. O Satori só aceita URL absoluta ou
 * data URI, e no build não existe servidor para apontar. Lê o mesmo arquivo que
 * o site serve — o cartão nunca mostra uma versão que a página não tem.
 */
function fotoEmbutida(src: string): string | null {
  if (!dadosDaImagem(src)) return null
  try {
    const bytes = arquivoPublico(src)
    const tipo = src.endsWith('.png') ? 'image/png' : 'image/jpeg'
    return `data:${tipo};base64,${bytes.toString('base64')}`
  } catch {
    // Arquivo listado no manifesto mas ausente do disco: cartão sem foto,
    // nunca build derrubado por causa de um cartão social.
    return null
  }
}

const ASSINATURA = 'GABRIELA SELEME'

function Assinatura() {
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: 'Inter',
        fontSize: 20,
        letterSpacing: 6,
        color: COR.inkMuted,
      }}
    >
      {ASSINATURA}
    </div>
  )
}

type CartaoObra = {
  titulo: string
  ano: string | null
  tecnica: string | null
  imagem: string | null
}

/**
 * Cartão de obra. Composição em duas colunas: a obra à esquerda, respirando
 * sobre o osso; nome, ano e técnica à direita, na mesma hierarquia da página.
 *
 * `contain`, não `cover`: cortar a obra para caber num retângulo 1,91:1 é
 * exatamente o que o WhatsApp faria sozinho, e é o que este cartão existe para
 * impedir. Peça vertical de 180 cm não vira faixa horizontal.
 */
export function cartaoDeObra({ titulo, ano, tecnica, imagem }: CartaoObra): ReactElement {
  const foto = imagem ? fotoEmbutida(imagem) : null

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: COR.bg,
        fontFamily: 'Inter',
      }}
    >
      {foto ? (
        <div
          style={{
            display: 'flex',
            width: 470,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 52,
            backgroundColor: COR.bgAlt,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={foto}
            alt=""
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>
      ) : null}

      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: foto ? '64px 72px' : '64px 88px',
        }}
      >
        <Assinatura />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Fraunces',
              fontSize: foto ? 84 : 120,
              lineHeight: 1.02,
              color: COR.ink,
            }}
          >
            {titulo}
          </div>

          {tecnica ? (
            <div
              style={{
                display: 'flex',
                marginTop: 26,
                fontSize: 26,
                lineHeight: 1.4,
                color: COR.inkMuted,
                maxWidth: foto ? 520 : 800,
              }}
            >
              {tecnica}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 22,
            letterSpacing: 2,
            color: COR.inkMuted,
          }}
        >
          {ano ? <div style={{ display: 'flex' }}>{ano}</div> : null}
          <div style={{ display: 'flex', flex: 1, height: 1, backgroundColor: COR.line }} />
        </div>
      </div>
    </div>
  )
}

/**
 * Cartão de página (portfólio, quem sou eu, textos, contato, um texto do
 * acervo editorial). Sem foto: o osso, o nome da seção e a assinatura.
 */
export function cartaoDePagina(titulo: string, subtitulo?: string | null): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '72px 88px',
        backgroundColor: COR.bg,
        fontFamily: 'Inter',
      }}
    >
      <Assinatura />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Fraunces',
            fontSize: 104,
            lineHeight: 1.02,
            color: COR.ink,
          }}
        >
          {titulo}
        </div>
        {subtitulo ? (
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.45,
              color: COR.inkMuted,
              maxWidth: 820,
            }}
          >
            {subtitulo}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', height: 1, backgroundColor: COR.line }} />
    </div>
  )
}

/** O `alt` do próprio cartão. Vai no metadado — leitor de tela o usa. */
export const altDoCartao: Record<Idioma, (titulo: string) => string> = {
  pt: (titulo) => `Cartão de compartilhamento: ${titulo} — Gabriela Seleme`,
  en: (titulo) => `Share card: ${titulo} — Gabriela Seleme`,
}

/**
 * O endereço impresso no rodapé do story — o "link de volta" que ela pediu.
 *
 * Só imprime o domínio quando ele é de verdade. Endereço de preview da Vercel
 * ou localhost numa imagem que vai para o Instagram é ruído que não leva a
 * lugar nenhum, e o domínio definitivo ainda está em aberto (CLAUDE.md). Até
 * lá, o @ do Instagram, que é onde o story vive de qualquer forma.
 */
export function enderecoDeVolta(): string {
  try {
    const { hostname } = new URL(urlDoSite())
    const provisorio =
      hostname === 'localhost' || hostname.endsWith('.vercel.app') || hostname.endsWith('.local')
    if (!provisorio) return hostname.replace(/^www\./, '')
  } catch {
    // URL torta não derruba a geração do cartão.
  }
  return `@${contato.instagram}`
}

type CartaoStory = {
  /** O trecho. Vem do conteúdo dela — resumo do texto ou legenda da obra. */
  trecho: string
  /** De onde o trecho saiu: nome do texto ou da obra. */
  origem: string
  rotuloOrigem: string
}

/**
 * O card de story — docs/03 §2, o pedido dela de 30/07/26: "compartilhar um
 * trecho de texto do site para o story, de forma bonita, com link de volta".
 *
 * Tipografia do site, paleta do site, e o trecho ocupando a tela como ocupa a
 * página. Sem moldura decorativa, sem gradiente, sem selo: o que faz um story
 * de galeria parecer galeria é o silêncio em volta do texto.
 *
 * A escala do trecho cai conforme ele cresce. Um resumo de 40 caracteres e um
 * de 300 no mesmo corpo dariam duas imagens que não parecem da mesma casa —
 * uma com um sussurro no meio do vazio, outra com texto batendo na borda.
 */
export function cartaoDeStory({ trecho, origem, rotuloOrigem }: CartaoStory): ReactElement {
  const tamanho = trecho.length > 220 ? 52 : trecho.length > 120 ? 64 : 78

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        // Folga maior em cima e embaixo: a interface do Instagram cobre cerca
        // de 200 px em cada ponta do story. Texto que entra ali fica escondido
        // atrás do avatar e da barra de responder.
        padding: '215px 110px 195px',
        backgroundColor: COR.bg,
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Inter',
          fontSize: 30,
          letterSpacing: 9,
          color: COR.inkMuted,
        }}
      >
        {ASSINATURA}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Fraunces',
            fontSize: tamanho,
            lineHeight: 1.32,
            color: COR.ink,
          }}
        >
          {trecho}
        </div>

        <div style={{ display: 'flex', marginTop: 64, height: 1, width: 180, backgroundColor: COR.line }} />

        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 26,
            letterSpacing: 3,
            color: COR.inkMuted,
          }}
        >
          {rotuloOrigem.toUpperCase()}
        </div>
        <div style={{ display: 'flex', marginTop: 14, fontSize: 34, color: COR.ink }}>
          {origem}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: 30,
          letterSpacing: 2,
          color: COR.inkMuted,
        }}
      >
        {enderecoDeVolta()}
      </div>
    </div>
  )
}
