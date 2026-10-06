import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, type Idioma } from '@/i18n/routing'
import { archivo, cormorant, inter } from '@/styles/fontes'
import { alternativas, cartaoSocial, urlDoSite, robotsDaPagina } from '@/lib/metadados'
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

  // Idioma inválido chega aqui de verdade: qualquer endereço com extensão
  // (/favicon.ico, /qualquer.txt) escapa do middleware de i18n e cai neste
  // segmento com locale = "favicon.ico". Sem esta guarda, generateMetadata
  // estourava e o servidor respondia 500 onde devia responder 404 — e um site
  // que devolve 500 para /favicon.ico parece quebrado para qualquer robô.
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(urlDoSite()),
    ...cartaoSocial({
      cartao: 'pagina/portfolio',
      titulo: t('tituloPadrao'),
      descricao: t('descricaoPadrao'),
      locale: locale as Idioma,
    }),
    title: { default: t('tituloPadrao'), template: `%s — ${t('tituloPadrao')}` },
    description: t('descricaoPadrao'),
    alternates: alternativas('/', locale),
    // Enquanto houver [PENDENTE] em rota publicada, nada é indexado.
    // docs/01 §7.7: "site indexado com [PENDENTE] é dano difícil de reverter".
    robots: robotsDaPagina(),
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
    <html lang={locale} className={`${cormorant.variable} ${inter.variable} ${archivo.variable}`}>
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
        {/*
          Speed Insights (item 31): LCP, CLS e INP de quem visita de verdade, no
          celular de verdade. O Lighthouse do CI mede um laboratório; isto mede
          o Instagram. Sem cookie e sem dado pessoal — por isso não depende do
          consentimento que o GA4 vai pedir.

          Sem o pacote @vercel/speed-insights, de propósito: ele punha ~5KB
          gzip no bundle de toda página para descobrir o nome da rota, e o
          orçamento de JS já está no limite (docs/11 §3). O script é o mesmo,
          servido pela própria Vercel, com `defer` como o pacote fazia; sem o
          nome da rota, o painel agrupa por endereço — com seis páginas por
          idioma, é até melhor de ler.

          Só existe no build da Vercel (VERCEL=1). Local, no CI e no teste não
          há script, não há 404, e o número de laboratório não muda.
        */}
        {process.env.VERCEL === '1' && <script defer src="/_vercel/speed-insights/script.js" />}
      </body>
    </html>
  )
}
