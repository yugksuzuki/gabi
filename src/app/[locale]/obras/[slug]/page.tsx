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
import { Prosa } from '@/components/ui/Prosa'
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
  const cotacao = await buscarCotacaoUSD()

  const texto = obra.texto && !ehPendente(obra.texto) ? obra.texto : null
  const preco = exibirPreco(obra.precoBRL, locale, cotacao)
  const obras = lerObras()
  const proxima = obras[(obras.findIndex((o) => o.slug === obra.slug) + 1) % obras.length]

  const principal = obra.imagens.find((im) => im.papel === 'principal')
  // A escala sai da grade e fecha a página em largura cheia: ela não mostra a
  // obra, mostra a obra NUM LUGAR — piso, rodapé, altura de pessoa. É a única
  // do conjunto que pede o quadro inteiro, e em grade de duas colunas ela ficava
  // órfã na última linha.
  const escala = obra.imagens.find((im) => im.papel === 'escala')
  const galeria = obra.imagens.filter((im) => im !== principal && im !== escala)

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
            // Desconta a margem lateral: declarar 100vw faz o navegador
            // baixar um arquivo maior do que o que vai desenhar.
            sizes="(max-width: 768px) calc(100vw - 3rem), 52rem"
          />
        </div>
      </div>

      {/* 2. Título e ano, na mesma linha de base. O ano é ficha de museu: fica
          na borda oposta, pequeno, sem competir com o nome da obra. */}
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 px-[var(--margem-lateral)] pt-14">
        <h1 className="font-display text-display leading-[0.95]">{obra.titulo}</h1>
        <p className="legenda pb-3">
          {ehPendente(obra.ano) ? <Pendente campo="ano" /> : obra.ano}
        </p>
      </header>

      <div className="mt-[var(--respiro-secao)] grid grid-cols-12 gap-y-16 px-[var(--margem-lateral)]">
        {/* 5. Texto autoral. Medida curta, entrelinha generosa. */}
        <div className="col-span-12 lg:col-span-6">
          {texto ? (
            <Prosa texto={texto} />
          ) : (
            <Pendente campo="texto" />
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
        <div className="mt-[var(--respiro-secao)] grid grid-cols-1 items-start gap-8 px-[var(--margem-lateral)] md:grid-cols-2">
          {galeria.map((img) => (
            <figure key={img.src} className="flex flex-col gap-3">
              <ImagemObra
                src={img.src}
                alt={localizar(img.alt, locale)}
                titulo={obra.titulo}
                sizes="(max-width: 768px) calc(100vw - 3rem), 45vw"
              />
              <figcaption className="legenda">{t(img.papel)}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* A obra num lugar. Fecha a sequência, centrada e com ar em volta.
          NÃO sangra: esta foto é um recorte da prancha de ficha e tem 822px de
          largura — esticada para 1440 ela seria ampliada quase o dobro, e a
          única imagem de contexto da página apareceria borrada. Fica no tamanho
          que a fonte aguenta, e o vazio em volta é composição. */}
      {escala && (
        <figure className="mt-[var(--respiro-secao)] flex flex-col gap-3 px-[var(--margem-lateral)]">
          <div className="mx-auto w-full max-w-[52rem]">
            <ImagemObra
              src={escala.src}
              alt={localizar(escala.alt, locale)}
              titulo={obra.titulo}
              sizes="(max-width: 768px) 100vw, 52rem"
            />
            <figcaption className="legenda mt-3">{t('escala')}</figcaption>
          </div>
        </figure>
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
