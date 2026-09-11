import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing, type Idioma } from '@/i18n/routing'
import { acharObra, lerObras, ehPendente } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { alternativas, cartaoSocial, robotsDaPagina } from '@/lib/metadados'
import { buscarCotacaoUSD, exibirPreco } from '@/lib/moeda'
import { ImagemObra } from '@/components/ui/ImagemObra'
import { Pendente } from '@/components/ui/Pendente'
import { FichaTecnica } from '@/components/obra/FichaTecnica'
import { Consultar } from '@/components/obra/Consultar'
import { MidiaObra } from '@/components/obra/MidiaObra'
import { Prosa } from '@/components/ui/Prosa'
import { DadosEstruturados } from '@/components/DadosEstruturados'
import { grafo, migalhas, obraEmSchema, pessoa } from '@/lib/schema'

type Props = { params: Promise<{ locale: Idioma; slug: string }> }

export function generateStaticParams() {
  // Cada obra pré-construída, nos dois idiomas (SSG, item 01).
  return routing.locales.flatMap((locale) =>
    lerObras().map((obra) => ({ locale, slug: obra.slug })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const obra = acharObra(slug)
  if (!obra) return {}

  const legenda = localizar(obra.legenda, locale)
  return {
    title: obra.titulo,
    alternates: alternativas({ pathname: '/obras/[slug]', params: { slug } }, locale),
    // Description escrita, nunca gerada por template genérico (docs/01 §6).
    // Sem legenda aprovada, não inventa: fica sem description.
    ...(legenda ? { description: legenda } : {}),
    // O cartão que aparece quando o link circula no Instagram e no WhatsApp.
    // Para uma obra é o primeiro contato — docs/01 §6.
    ...cartaoSocial({
      cartao: `obra/${slug}`,
      titulo: obra.titulo,
      descricao: legenda,
      locale,
    }),
    // A obra decide sozinha: enquanto não for `publicada`, ela não entra no
    // índice nem que a trava global esteja aberta. É a MESMA condição que o
    // sitemap usa — duas regras diferentes para a mesma pergunta acabariam
    // divergindo, e o build já garante que `publicada` implica ficha completa.
    robots: robotsDaPagina({ temPendencia: obra.estado !== 'publicada' }),
  }
}

/**
 * A página da obra, redesenhada pela revisão de 27/08 (docs/08 §3):
 *
 * > "Reformule a visualização para um formato editorial, obra em destaque
 * > absoluto, uma foto da obra com opção de zoom para ampliação da imagem +
 * > vídeo da obra — a transição entre uma coisa e outra em forma de scroll para
 * > o lado, ficha técnica limpa e canal de aquisição discreto. Galeria com
 * > imagem à direita, texto e detalhes técnicos à esquerda."
 *
 *   O1/O2/O4/O5  foto única com zoom + vídeo, lado a lado — MidiaObra.
 *                A galeria de ângulos, o detalhe e a escala saíram da página
 *                (os arquivos ficam: são dado da obra, não layout)
 *   O3           imagem à direita, texto e ficha à esquerda
 *   O6/O7        ficha como a folha dela, sem rótulos — FichaTecnica
 *   O8/O9        sem o rótulo "VALOR"; o preço em cinza, menor que o resto
 *   O10          Consultar como link, não botão com caixa
 *
 * No celular, a ordem de leitura é nome → obra → texto → ficha: a obra vem
 * antes do texto, como numa parede de galeria.
 *
 * Em tela larga a obra fica PARADA (sticky) enquanto o texto corre ao lado — a
 * pessoa lê olhando para a peça. É a obra em destaque absoluto sem precisar ser
 * maior que a tela.
 */
export default async function PaginaObra({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const obra = acharObra(slug)
  if (!obra) notFound()

  const t = await getTranslations('obra')
  const tPortfolio = await getTranslations('portfolio')
  const cotacao = await buscarCotacaoUSD()

  const texto = obra.texto && !ehPendente(obra.texto) ? obra.texto : null
  const preco = exibirPreco(obra.precoBRL, locale, cotacao)
  const nota = localizar(obra.nota, locale)
  const obras = lerObras()
  const proxima = obras[(obras.findIndex((o) => o.slug === obra.slug) + 1) % obras.length]

  const principal = obra.imagens.find((im) => im.papel === 'principal')
  const altPrincipal = localizar(principal?.alt, locale)
  // A mídia só entra com a foto COMPLETA: arquivo processado e alt aprovado.
  // Faltando qualquer um, a moldura assume — mesma regra do ImagemObra.
  const foto =
    principal?.largura && principal.altura && principal.lqip && altPrincipal
      ? {
          src: principal.src,
          alt: altPrincipal,
          largura: principal.largura,
          altura: principal.altura,
          lqip: principal.lqip,
        }
      : null
  const video = obra.video?.src
    ? { mp4: obra.video.src, webm: obra.video.webm, poster: obra.video.poster }
    : null

  return (
    <article className="pt-12 md:pt-20">
      {/* VisualArtwork + Person + BreadcrumbList (docs/03 §7). Campo pendente
          é omitido, nunca inventado: dado estruturado sai do nosso controle. */}
      <DadosEstruturados
        json={grafo(
          pessoa(locale),
          obraEmSchema(obra, locale),
          migalhas(obra, locale, tPortfolio('titulo')),
        )}
      />

      <div className="grid grid-cols-12 gap-y-12 px-[var(--margem-lateral)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12 lg:gap-y-16">
        <header className="col-span-12 lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <h1 className="font-display text-display leading-[1.05]">{obra.titulo}</h1>
          <p className="legenda mt-2">
            {ehPendente(obra.ano) ? <Pendente campo="ano" /> : obra.ano}
          </p>
        </header>

        <div className="col-span-12 lg:sticky lg:top-10 lg:col-span-6 lg:col-start-7 lg:row-span-3 lg:row-start-1 lg:self-start">
          {foto ? (
            <MidiaObra
              foto={foto}
              video={video}
              rotulos={{
                midia: t('midia'),
                ampliar: t('ampliar'),
                reduzir: t('reduzir'),
                fechar: t('fechar'),
                foto: t('foto'),
                video: t('video'),
                videoDaObra: t('videoDaObra', { titulo: obra.titulo }),
              }}
            />
          ) : (
            <div className="mx-auto max-w-[28rem] lg:mr-0">
              <ImagemObra src="" alt={null} titulo={obra.titulo} />
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-1 lg:row-start-2">
          {texto ? <Prosa texto={texto} /> : <Pendente campo="texto" />}
        </div>

        <div className="col-span-12 flex flex-col items-start gap-7 lg:col-span-5 lg:col-start-1 lg:row-start-3">
          {/* Nota da peça — onde ela está agora. Vem ANTES da ficha: a ficha é o
              que a obra é e não muda; a nota muda quando a peça troca de sala. */}
          {nota && <p className="legenda">{nota}</p>}

          <FichaTecnica obra={obra} idioma={locale} />

          <div className="flex flex-col items-start gap-6">
            {/* O9: cinza e menor que o resto. O preço informa; não vende. */}
            <p className="font-interface text-preco text-ink-muted tracking-[0.02em]">
              {preco ?? t('sobConsulta')}
            </p>
            <Consultar titulo={obra.titulo} idioma={locale} />
          </div>
        </div>
      </div>

      {/* Mantém a pessoa dentro do acervo. */}
      {proxima.slug !== obra.slug && (
        <nav className="border-line mt-[var(--respiro-secao)] border-t px-[var(--margem-lateral)] pt-8">
          <Link
            href={{ pathname: '/obras/[slug]', params: { slug: proxima.slug } }}
            className="group flex flex-col gap-2"
          >
            <span className="legenda">{t('proximaObra')}</span>
            <span className="font-display text-titulo transition-opacity group-hover:opacity-60">
              {proxima.titulo} →
            </span>
          </Link>
        </nav>
      )}
    </article>
  )
}
