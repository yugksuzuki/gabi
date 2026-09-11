import { useTranslations } from 'next-intl'
import { linkDeConsulta } from '@/lib/whatsapp'
import type { Idioma } from '@/i18n/routing'

/**
 * "Consultar" — nunca "comprar" (regra 3 do CLAUDE.md; checklist docs/02 §8
 * proíbe as palavras comprar/adicionar/produto/item no site inteiro).
 *
 * Peça única se negocia por conversa. Sem número de WhatsApp configurado, o
 * mesmo botão vira mailto: com o assunto equivalente — e ninguém percebe falta.
 *
 * O10 da revisão de 27/08: deixou de ser botão com caixa. Ela riscou a caixa e
 * pediu "canal de aquisição discreto" — é um link sublinhado por um filete.
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
      className="font-interface text-legenda border-line-forte hover:border-ink w-fit border-b pb-1 tracking-[0.12em] uppercase transition-colors"
    >
      {t('consultar')}
    </a>
  )
}
