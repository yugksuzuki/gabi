import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing, type Idioma } from '@/i18n/routing'
import { acharTexto, campo, corpoNoIdioma, textosVisiveis } from '@/lib/textos'
import { lerObras } from '@/lib/obras'
import { formatarData } from '@/lib/data'
import { alternativas, cartaoSocial } from '@/lib/metadados'
import { Prosa } from '@/components/ui/Prosa'

type Props = { params: Promise<{ locale: Idioma; slug: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    textosVisiveis().map((texto) => ({ locale, slug: texto.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const texto = acharTexto(slug)
  if (!texto) return {}

  const titulo = campo(texto.titulo, locale)
  return {
    title: titulo,
    description: campo(texto.resumo, locale),
    alternates: alternativas({ pathname: '/textos/[slug]', params: { slug } }, locale),
    ...cartaoSocial({
      cartao: `texto/${slug}`,
      titulo,
      descricao: campo(texto.resumo, locale),
      locale,
    }),
    robots: { index: false, follow: false },
  }
}

/**
 * Um texto. Medida curta, entrelinha generosa, nada disputando atenção com a
 * leitura — texto de artista se lê devagar (docs/02 §3).
 *
 * O link para o card de story fica no rodapé da página, discreto: quem usa é
 * ela, para postar (o pedido dela de 30/07/26). Um botão de compartilhar em
 * cada canto seria widget de rede social, e widget está fora do escopo da v1.
 */
export default async function Texto({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const texto = acharTexto(slug)
  if (!texto) notFound()

  const t = await getTranslations('textos')
  const { corpo, idiomaReal, traduzido } = corpoNoIdioma(texto, locale)
  if (!corpo) notFound()

  const relacionadas = lerObras().filter((o) => texto.obrasRelacionadas.includes(o.slug))

  return (
    <article className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]">
      <div className="mx-auto max-w-[var(--medida-corpo)]">
        <time dateTime={texto.publicadoEm} className="legenda">
          {formatarData(texto.publicadoEm, locale)}
        </time>

        <h1 className="font-display mt-6 text-display leading-[1.02]">
          {campo(texto.titulo, locale)}
        </h1>

        {texto.estado === 'rascunho' && (
          <p
            role="status"
            className="border-line-forte text-ink-muted mt-10 w-fit border border-dashed px-4 py-2 text-legenda"
          >
            {t('rascunho')}
          </p>
        )}

        {/* Sem versão dela em inglês, mostra o português marcado e avisa.
            Traduzir voz de artista por conta própria é decisão que não é
            nossa — docs/03 §4. */}
        {!traduzido && (
          <p
            role="status"
            className="border-line-forte text-ink-muted mt-10 border border-dashed px-5 py-3 text-legenda"
          >
            {t('traducaoPendente')}
          </p>
        )}

        <Prosa
          texto={corpo}
          lang={idiomaReal === locale ? undefined : idiomaReal}
          className="mt-14 text-corpo"
        />

        {relacionadas.length > 0 && (
          <nav aria-labelledby="citadas" className="border-line mt-20 border-t pt-8">
            <h2 id="citadas" className="legenda mb-5">
              {t('obrasCitadas')}
            </h2>
            <ul className="flex flex-col gap-3">
              {relacionadas.map((obra) => (
                <li key={obra.slug}>
                  <Link
                    href={{ pathname: '/obras/[slug]', params: { slug: obra.slug } }}
                    className="font-display text-titulo transition-opacity hover:opacity-60"
                  >
                    {obra.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* O pedido dela: um trecho do site vira imagem de story, com o link de
            volta. A rota gera a imagem; aqui é só onde ela a encontra. */}
        <p className="border-line mt-16 border-t pt-6">
          <a
            href={`/story/${locale}/texto/${slug}.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="legenda hover:text-ink"
          >
            {t('story')} →
          </a>
        </p>
      </div>
    </article>
  )
}
