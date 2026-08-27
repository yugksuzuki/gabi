import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { alternativas, cartaoSocial, robotsDaPagina } from '@/lib/metadados'
import { campo, textosVisiveis } from '@/lib/textos'
import { formatarData } from '@/lib/data'
import type { Idioma } from '@/i18n/routing'

type Props = { params: Promise<{ locale: Idioma }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'textos' })
  return {
    title: t('titulo'),
    alternates: alternativas('/textos', locale),
    ...cartaoSocial({ cartao: 'pagina/textos', titulo: t('titulo'), locale }),
    robots: robotsDaPagina(),
  }
}

/**
 * Listagem da área editorial.
 *
 * Vazio é um estado de primeira classe aqui, não um acidente: CLAUDE.md diz que
 * tudo precisa renderizar bem vazio, e o projeto já parou duas vezes esperando
 * material. A página em branco tem que parecer decisão, não erro.
 *
 * A listagem é uma sequência de linhas, não uma grade de cards. Card com resumo
 * é blog; linha com data, título e resumo é sumário de publicação — e sumário
 * é o que uma área editorial de galeria é.
 */
export default async function Textos({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('textos')
  const textos = textosVisiveis()

  return (
    <div className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]">
      <h1 className="font-display text-display leading-[0.95]">{t('titulo')}</h1>

      {textos.length === 0 ? (
        <p className="text-ink-muted mt-12 max-w-[var(--medida-corpo)] text-corpo">
          {t('vazio')}
        </p>
      ) : (
        <ul className="border-line mt-14 border-t">
          {textos.map((texto) => (
            <li key={texto.slug} className="border-line border-b">
              <Link
                href={{ pathname: '/textos/[slug]', params: { slug: texto.slug } }}
                className="group grid grid-cols-12 gap-y-3 py-9 md:gap-x-8"
              >
                <time
                  dateTime={texto.publicadoEm}
                  className="legenda col-span-12 pt-2 md:col-span-2"
                >
                  {formatarData(texto.publicadoEm, locale)}
                </time>

                <div className="col-span-12 flex flex-col gap-3 md:col-span-8">
                  <h2 className="font-display text-titulo leading-[1.1] transition-opacity group-hover:opacity-60">
                    {campo(texto.titulo, locale)}
                  </h2>
                  <p className="text-ink-muted max-w-[52ch] text-corpo">
                    {campo(texto.resumo, locale)}
                  </p>
                  {texto.estado === 'rascunho' && (
                    <span className="border-line-forte text-ink-muted w-fit border border-dashed px-3 py-1 text-legenda">
                      {t('rascunho')}
                    </span>
                  )}
                </div>

                <span className="legenda col-span-12 self-end md:col-span-2 md:text-right">
                  {t('ler')} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
