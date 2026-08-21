import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const pedido = await requestLocale
  const locale = hasLocale(routing.locales, pedido) ? pedido : routing.defaultLocale

  return {
    locale,
    // messages/ é INTERFACE, nunca conteúdo autoral — docs/01 §3.
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
