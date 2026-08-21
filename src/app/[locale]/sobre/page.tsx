import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { lerSobre } from '@/lib/sobre'
import { alternativas } from '@/lib/metadados'
import type { Idioma } from '@/i18n/routing'

type Props = { params: Promise<{ locale: Idioma }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sobre' })
  return {
    title: t('titulo'),
    alternates: alternativas('/sobre', locale),
    robots: { index: false, follow: false },
  }
}

export default async function Sobre({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('sobre')
  const tp = await getTranslations('pendente')
  const { corpo, revisaoEn } = lerSobre()

  // A tradução ainda não foi aprovada por ela. Em vez de traduzir por conta
  // própria, mostra o original marcado com lang="pt" — docs/03 §4.
  const emPortuguesNoIngles = locale === 'en' && revisaoEn !== 'aprovada'

  return (
    <div className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]">
      <h1 className="font-display text-display leading-[0.95]">{t('titulo')}</h1>

      {emPortuguesNoIngles && (
        <p
          role="status"
          className="border-line-forte text-ink-muted mt-10 max-w-[var(--medida-corpo)] border border-dashed px-5 py-3 text-legenda"
        >
          {tp('aviso')} — English translation pending the artist&rsquo;s approval. Shown in
          Portuguese, in her own words.
        </p>
      )}

      <div
        {...(emPortuguesNoIngles ? { lang: 'pt' } : {})}
        className="mt-14 max-w-[var(--medida-corpo)] text-corpo [&>p]:mb-6"
      >
        {corpo.split(/\n{2,}/).map((paragrafo, i) => (
          <p key={i}>{renderizarEnfase(paragrafo)}</p>
        ))}
      </div>
    </div>
  )
}

/** A folha dela tem uma única palavra em negrito: **expressão**. Preserva. */
function renderizarEnfase(texto: string) {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
    parte.startsWith('**') && parte.endsWith('**') ? (
      <strong key={i} className="font-medium">
        {parte.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{parte}</span>
    )
  )
}
