import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { fraunces, inter } from '@/styles/fontes'
import { alternativas, urlDoSite } from '@/lib/metadados'
import { Nav } from '@/components/layout/Nav'
import { Rodape } from '@/components/layout/Rodape'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(urlDoSite()),
    title: { default: t('tituloPadrao'), template: `%s — ${t('tituloPadrao')}` },
    description: t('descricaoPadrao'),
    alternates: alternativas('/', locale),
    // Enquanto houver [PENDENTE] em rota publicada, nada é indexado.
    // docs/01 §7.7: "site indexado com [PENDENTE] é dano difícil de reverter".
    robots: { index: false, follow: false },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Habilita renderização estática — cada rota pré-construída (item 01).
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <a href="#conteudo" className="pular-para-conteudo">
            {t('pularParaConteudo')}
          </a>
          <Nav />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Rodape />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
