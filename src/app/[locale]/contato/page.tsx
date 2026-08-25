import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import contato from '@/lib/contato'
import { exibirTelefone, linkDeConsulta } from '@/lib/whatsapp'
import { alternativas } from '@/lib/metadados'
import type { Idioma } from '@/i18n/routing'

type Props = { params: Promise<{ locale: Idioma }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contato' })
  return {
    title: t('titulo'),
    alternates: alternativas('/contato', locale),
    robots: { index: false, follow: false },
  }
}

export default async function Contato({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contato')

  // Sem obra específica: a consulta é geral. Mesmo mecanismo, mesmo fallback.
  const { href, canal, numero } = linkDeConsulta('Gabriela Seleme', locale)

  const linhas = [
    { rotulo: t('email'), texto: contato.email, href: `mailto:${contato.email}`, externo: false },
    {
      rotulo: t('instagram'),
      texto: `@${contato.instagram}`,
      href: contato.instagramUrl,
      externo: true,
    },
    // O número aparece escrito. Um link que só diz "WhatsApp" obriga a pessoa a
    // clicar para descobrir para onde vai — e quem prefere salvar o contato no
    // celular, ou ligar, fica sem o número.
    ...(canal === 'whatsapp' && numero
      ? [{ rotulo: t('whatsapp'), texto: exibirTelefone(numero), href, externo: true }]
      : []),
  ]

  return (
    <div className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]">
      <h1 className="font-display text-display leading-[0.95]">{t('titulo')}</h1>

      <dl className="border-line mt-14 max-w-[46ch] border-t">
        {linhas.map((linha) => (
          <div
            key={linha.rotulo}
            className="border-line grid grid-cols-[9rem_1fr] gap-x-4 border-b py-4"
          >
            <dt className="legenda pt-1">{linha.rotulo}</dt>
            <dd className="text-corpo">
              <a
                href={linha.href}
                {...(linha.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="underline decoration-line-forte underline-offset-4 transition-opacity hover:opacity-60"
              >
                {linha.texto}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
