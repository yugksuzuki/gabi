import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Idioma } from '@/i18n/routing'

/**
 * Captura qualquer endereço dentro de um idioma que não casa com rota alguma:
 * /pt/qualquer-coisa, /en/works/slug-que-mudou.
 *
 * Sem isto, o Next cai no 404 GLOBAL, que vive fora de [locale] e por isso sai
 * sem nav, sem rodapé e sempre em português — a pessoa perde o site inteiro por
 * causa de um link velho. Com isto, ela cai numa página do site, no idioma em
 * que estava, com o caminho de volta à mão.
 *
 * O 404 global continua existindo para o que nem chega a ter idioma (endereço
 * com extensão, que o middleware de i18n não toca).
 */
export default async function Resto({
  params,
}: {
  params: Promise<{ locale: Idioma }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  notFound()
}
