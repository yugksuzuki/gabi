import { useTranslations } from 'next-intl'

/**
 * Placeholder que se anuncia — regra 2 do CLAUDE.md.
 *
 * "Não existe texto placeholder plausível neste projeto." Este componente
 * existe para que a ausência seja impossível de confundir com conteúdo: se
 * vazar para produção, quem olhar vê que vazou. É o oposto de lorem ipsum.
 */
export function Pendente({ campo }: { campo: string }) {
  const t = useTranslations('pendente')

  return (
    <span
      className="border-line-forte text-ink-muted inline-flex w-fit max-w-full self-start items-baseline gap-1.5 border border-dashed px-2 py-0.5 align-baseline text-legenda tracking-[0.08em] uppercase"
      title={t('aviso')}
    >
      <span aria-hidden="true">◇</span>
      {t('rotulo')}: {campo}
    </span>
  )
}
