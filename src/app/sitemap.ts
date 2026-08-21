import type { MetadataRoute } from 'next'
import { getPathname } from '@/i18n/navigation'
import { idiomas, routing } from '@/i18n/routing'
import { lerObras } from '@/lib/obras'
import { urlDoSite } from '@/lib/metadados'

type Href = Parameters<typeof getPathname>[0]['href']

/**
 * As duas versões de cada página, com alternates recíprocos (docs/01 §6).
 *
 * Só entram obras em estado `publicada`: a promessa é "obra sem ficha técnica
 * completa não é publicada", e sitemap é publicação.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDoSite()

  const url = (href: Href, locale: string) => base + getPathname({ href, locale })

  const entrada = (href: Href): MetadataRoute.Sitemap[number] => ({
    url: url(href, routing.defaultLocale),
    alternates: {
      languages: Object.fromEntries(idiomas.map((i) => [i, url(href, i)])),
    },
  })

  const fixas: Href[] = ['/', '/sobre', '/textos', '/contato']

  const obras = lerObras()
    .filter((o) => o.estado === 'publicada')
    .map((o): Href => ({ pathname: '/obras/[slug]', params: { slug: o.slug } }))

  return [...fixas, ...obras].map(entrada)
}
