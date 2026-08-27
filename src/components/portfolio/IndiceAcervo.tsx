import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ehPendente, type Obra } from '@/lib/obras'

/**
 * O acervo inteiro numa tira, logo abaixo da entrada.
 *
 * Existe por dois motivos. O primeiro é de composição: sem ele, a faixa entre a
 * entrada e a primeira obra era um vazio que lia como erro de layout, não como
 * respiro. O segundo é de leitura: quem chega vê de saída que o acervo tem três
 * peças e quais são — em vez de descobrir rolando.
 *
 * É índice editorial, não grade de produto: número, nome, ano. Nada de imagem,
 * nada de preço, nada de botão.
 */
export function IndiceAcervo({ obras }: { obras: Obra[] }) {
  const t = useTranslations('portfolio')

  return (
    <nav
      aria-label={t('acervo')}
      className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]"
    >
      <h2 className="legenda mb-1">{t('acervo')}</h2>
      <ul className="border-line grid grid-cols-1 border-t sm:grid-cols-3 sm:gap-x-8">
        {obras.map((obra, i) => (
          <li key={obra.slug} className="border-line border-b sm:border-b-0">
            <Link
              href={{ pathname: '/obras/[slug]', params: { slug: obra.slug } }}
              className="group flex flex-col gap-1.5 py-5"
            >
              <span className="legenda tracking-[0.18em]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-titulo leading-none transition-opacity group-hover:opacity-60">
                {obra.titulo}
              </span>
              {!ehPendente(obra.ano) && <span className="legenda">{obra.ano}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
