import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternativas } from '@/lib/metadados'
import type { Idioma } from '@/i18n/routing'

type Props = { params: Promise<{ locale: Idioma }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'textos' })
  return {
    title: t('titulo'),
    alternates: alternativas('/textos', locale),
    robots: { index: false, follow: false },
  }
}

/**
 * Área editorial. content/textos/ está vazio — e vazio é um estado que precisa
 * renderizar bem (CLAUDE.md: "tudo precisa renderizar bem vazio").
 *
 * O card de story 1080×1920 (o pedido dela de 30/07/26) e o MDX completo são E4.
 */
export default async function Textos({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('textos')

  return (
    <div className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]">
      <h1 className="font-display text-display leading-[0.95]">{t('titulo')}</h1>
      <p className="text-ink-muted mt-12 max-w-[var(--medida-corpo)] text-corpo">
        {t('vazio')}
      </p>
    </div>
  )
}
