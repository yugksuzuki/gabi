'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { acharTemplate } from '@/i18n/rotas'
import { idiomas } from '@/i18n/routing'

/**
 * A troca de idioma MANTÉM a página (docs/03 §4).
 *
 * /pt/obras/instante -> /en/works/instante, e não a home.
 * "Isso quebra em quase todo site bilíngue e é perceptível" — e é o critério de
 * pronto da E0, por isso o matcher de rotas tem teste próprio
 * (scripts/verificar-rotas.mjs).
 */
export function TrocaIdioma() {
  const t = useTranslations('idioma')
  const params = useParams()

  // `usePathname` devolve o caminho interno já resolvido; o mapa de rotas é
  // indexado pelo template. `acharTemplate` faz a ponte entre os dois.
  const template = acharTemplate(usePathname())

  // `locale` vem junto em useParams mas não é parâmetro de rota — quem manda é
  // o `locale` do próprio Link.
  const parametrosDaRota = Object.fromEntries(
    Object.entries(params).filter(([chave]) => chave !== 'locale')
  )

  return (
    <nav aria-label={t('rotulo')} className="flex items-center gap-1">
      {idiomas.map((idioma, i) => (
        <span key={idioma} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="text-ink-muted mx-1.5 text-legenda">
              /
            </span>
          )}
          <Link
            href={
              { pathname: template, params: parametrosDaRota } as Parameters<
                typeof Link
              >[0]['href']
            }
            locale={idioma}
            hrefLang={idioma}
            className="text-legenda tracking-[0.12em] uppercase transition-opacity hover:opacity-60"
          >
            {t(idioma)}
          </Link>
        </span>
      ))}
    </nav>
  )
}
