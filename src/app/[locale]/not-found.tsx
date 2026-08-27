import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

/**
 * 404 dentro do idioma. Herda nav e rodapé do layout, então quem cai aqui
 * continua dentro do site em vez de bater numa parede.
 *
 * Acontece de verdade: link de obra compartilhado no Instagram, slug corrigido
 * depois, endereço digitado errado. O caminho de volta é o portfólio, porque é
 * a home e é o acervo.
 */
export default function NaoEncontrado() {
  const t = useTranslations('naoEncontrado')

  return (
    <div className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]">
      <h1 className="font-display text-display leading-[0.95]">{t('titulo')}</h1>
      <p className="text-ink-muted mt-10 max-w-[46ch] text-corpo">{t('recado')}</p>
      <Link href="/" className="legenda hover:text-ink mt-10 inline-block">
        {t('voltar')} →
      </Link>
    </div>
  )
}
