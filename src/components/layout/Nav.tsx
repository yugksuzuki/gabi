import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { TrocaIdioma } from './TrocaIdioma'

/**
 * Menu discreto, sem barra pesada (docs/02 §1). Não é sticky nem opaco: a
 * referência é galeria, e galeria não põe uma barra cinza sobre a obra.
 *
 * As quatro abas são decisão travada da cliente:
 * Portfólio · Quem sou eu · Textos · Contato.
 */
export function Nav() {
  const t = useTranslations('nav')

  const abas = [
    { href: '/sobre', rotulo: t('sobre') },
    { href: '/textos', rotulo: t('textos') },
    { href: '/contato', rotulo: t('contato') },
  ] as const

  return (
    <header className="px-[var(--margem-lateral)] pt-8 pb-4 md:pt-10">
      {/* Mobile primeiro: marca em uma linha, navegação na seguinte. Empilhar é
          o que impede "Quem sou eu" de quebrar no meio da frase a 390px. */}
      <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-x-8">
        <Link
          href="/"
          className="font-display w-fit text-[1.35rem] leading-none tracking-[0.02em] transition-opacity hover:opacity-60 md:text-[1.6rem]"
        >
          Gabriela Seleme
        </Link>

        <div className="flex items-baseline justify-between gap-6 md:justify-end md:gap-9">
          <nav aria-label={t('rotulo')}>
            <ul className="flex items-baseline gap-5 md:gap-8">
              {abas.map((aba) => (
                <li key={aba.href}>
                  <Link
                    href={aba.href}
                    className="text-legenda tracking-[0.1em] whitespace-nowrap uppercase transition-opacity hover:opacity-60"
                  >
                    {aba.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <TrocaIdioma />
        </div>
      </div>
    </header>
  )
}
