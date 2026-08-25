import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing, type Idioma } from '@/i18n/routing'
import { acharObra, lerObras, ehPendente } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { alternativas, cartaoSocial } from '@/lib/metadados'
import { buscarCotacaoUSD, exibirPreco } from '@/lib/moeda'
import { ImagemObra } from '@/components/ui/ImagemObra'
import { Pendente } from '@/components/ui/Pendente'
import { FichaTecnica } from '@/components/obra/FichaTecnica'
import { Consultar } from '@/components/obra/Consultar'
import { DadosEstruturados } from '@/components/DadosEstruturados'
import { grafo, migalhas, obraEmSchema, pessoa } from '@/lib/schema'

type Props = { params: Promise<{ locale: Idioma; slug: string }> }

export function generateStaticParams() {
  // Cada obra pré-construída, nos dois idiomas (SSG, item 01).
  return routing.locales.flatMap((locale) =>
    lerObras().map((obra) => ({ locale, slug: obra.slug }))
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
    robots: { index: false, follow: false },
  }
}

/**
 * Anatomia na ordem de leitura de docs/01 §1: imagem principal grande, título e
 * ano, galeria, vídeo, texto autoral, ficha técnica, preço + Consultar,
 * navegação para a obra seguinte.
 *
 * O preço NÃO é o elemento mais destacado. Ele informa; não vende.
 */
export default async function PaginaObra({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const obra = acharObra(slug)
  if (!obra) notFound()

  const t = await getTranslations('obra')
  const tp = await getTranslations('pendente')
  const cotacao = await buscarCotacaoUSD()

  const texto = obra.texto && !ehPendente(obra.texto) ? obra.texto : null
  const preco = exibirPreco(obra.precoBRL, locale, cotacao)
  const obras = lerObras()
  const proxima = obras[(obras.findIndex((o) => o.slug === obra.slug) + 1) % obras.length]

  const principal = obra.imagens.find((im) => im.papel === 'principal')
  // Ângulo, detalhe e escala — tudo que não é a principal alimenta a galeria.
  const galeria = obra.imagens.filter((im) => im !== principal)

  const tPortfolio = await getTranslations('portfolio')

  return (
    <article className="pt-[var(--respiro-secao)]">
      {/* VisualArtwork + Person + BreadcrumbList (docs/03 §7). Campo pendente
          é omitido, nunca inventado: dado estruturado sai do nosso controle. */}
      <DadosEstruturados
        json={grafo(
          pessoa(locale),
          obraEmSchema(obra, locale),
          migalhas(obra, locale, tPortfolio('titulo'))
        )}
      />
      {/* 1. Imagem principal, grande, quase sem cerimônia. */}
      <div className="px-[var(--margem-lateral)]">
        <div className="mx-auto max-w-[52rem]">
          <ImagemObra
            src={principal?.src ?? ''}
            alt={localizar(principal?.alt, locale)}
            titulo={obra.titulo}
            prioridade
            sizes="(max-width: 768px) 100vw, 52rem"
          />
        </div>
      </div>

      {/* 2. Título e ano. */}
      <header className="px-[var(--margem-lateral)] pt-12">
        <h1 className="font-display text-display leading-[0.95]">{obra.titulo}</h1>
        <p className="legenda mt-4">{ehPendente(obra.ano) ? <Pendente campo="ano" /> : obra.ano}</p>
      </header>

      {obra.estado === 'rascunho' && (
        <p
          role="status"
          className="border-line-forte text-ink-muted mx-[var(--margem-lateral)] mt-10 border border-dashed px-5 py-3 text-legenda"
        >
          {tp('obraIncompleta')}
        </p>
      )}

      <div className="mt-[var(--respiro-secao)] grid grid-cols-12 gap-y-16 px-[var(--margem-lateral)]">
        {/* 5. Texto autoral. Medida curta, entrelinha generosa. */}
        <div className="col-span-12 lg:col-span-6">
          {texto ? (
            <div className="max-w-[var(--medida-corpo)] text-corpo [&>p]:mb-5">
              {texto.split(/\n{2,}/).map((paragrafo, i) => (
                <p key={i}>
                  {/* Quebra simples é dela: a prancha de Encontro quebra as
                      frases num ritmo próprio. Não juntar. */}
                  {paragrafo.split('\n').map((linha, j, todas) => (
                    <span key={j}>
                      {linha}
                      {j < todas.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          ) : (
            <Pendente campo="texto da obra" />
          )}
        </div>

        {/* 6 e 7. Ficha técnica, depois valor e Consultar. */}
        <div className="col-span-12 flex flex-col gap-12 lg:col-span-5 lg:col-start-8">
          <FichaTecnica obra={obra} idioma={locale} />

          <section aria-labelledby="valor" className="flex flex-col gap-5">
            <h2 id="valor" className="legenda">
              {t('preco')}
            </h2>
            <p className="text-corpo">{preco ?? t('sobConsulta')}</p>
            <Consultar titulo={obra.titulo} idioma={locale} />
          </section>
        </div>
      </div>

      {/* 3. Galeria: ângulo, detalhe, escala. Duas colunas em tela larga, uma
          no celular, e cada foto no seu próprio tamanho — sem recorte forçado. */}
      {galeria.length > 0 && (
        <div className="mt-[var(--respiro-secao)] grid grid-cols-1 gap-8 px-[var(--margem-lateral)] md:grid-cols-2">
          {galeria.map((img) => (
            <figure key={img.src} className="flex flex-col gap-3">
              <ImagemObra
                src={img.src}
                alt={localizar(img.alt, locale)}
                titulo={obra.titulo}
                sizes="(max-width: 768px) 100vw, 45vw"
              />
              <figcaption className="legenda">{t(img.papel)}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* 8. Mantém a pessoa dentro do acervo. */}
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
