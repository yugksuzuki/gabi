import { useTranslations } from 'next-intl'
import { linkDeConsulta } from '@/lib/whatsapp'
import type { Idioma } from '@/i18n/routing'

/**
 * "Consultar" — nunca "comprar" (regra 3 do CLAUDE.md; checklist docs/02 §8
 * proíbe as palavras comprar/adicionar/produto/item no site inteiro).
 *
 * Peça única se negocia por conversa. Sem número de WhatsApp configurado, o
 * mesmo botão vira mailto: com o assunto equivalente — e ninguém percebe falta.
 */
export function Consultar({ titulo, idioma }: { titulo: string; idioma: Idioma }) {
  const t = useTranslations('obra')
  const { href, canal } = linkDeConsulta(titulo, idioma)

  return (
    <a
      href={href}
      {...(canal === 'whatsapp'
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className="border-ink hover:bg-ink hover:text-bg inline-flex w-fit items-center border px-7 py-3 text-legenda tracking-[0.12em] uppercase transition-colors"
    >
      {t('consultar')}
    </a>
  )
}
