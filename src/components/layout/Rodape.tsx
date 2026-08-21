import { useTranslations } from 'next-intl'
import contato from '@/lib/contato'

export function Rodape() {
  const t = useTranslations()
  const ano = new Date().getFullYear()

  return (
    <footer className="border-line mt-[var(--respiro-secao)] border-t px-[var(--margem-lateral)] py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <p className="legenda">
          © {ano} Gabriela Seleme. {t('rodape.direitos')}
        </p>
        <ul className="flex flex-wrap items-baseline gap-5">
          <li>
            <a href={`mailto:${contato.email}`} className="legenda hover:text-ink">
              {contato.email}
            </a>
          </li>
          <li>
            <a
              href={contato.instagramUrl}
              rel="noopener noreferrer me"
              target="_blank"
              className="legenda hover:text-ink"
            >
              @{contato.instagram}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
