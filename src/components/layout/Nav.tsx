import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dadosDaImagem } from '@/lib/obras'
import { TrocaIdioma } from './TrocaIdioma'

/**
 * Menu discreto, sem barra pesada (docs/02 §1). Não é sticky nem opaco: a
 * referência é galeria, e galeria não põe uma barra cinza sobre a obra.
 *
 * As quatro abas são decisão travada da cliente, com os nomes que ela deu na
 * revisão de 27/08: Portfólio · A artista · Ensaios · Contato.
 *
 * G1 da mesma revisão: onde havia o nome tipografado, agora vai A LOGO. Ela
 * escreveu "sempre a logo", em todas as páginas — e este cabeçalho é todas as
 * páginas. O wordmark "Gabriela Seleme" em Cormorant saiu daqui.
 *
 * BLOQUEIO CONHECIDO: o que existe é raster. `public/marca/rubrica.png` é o
 * recorte já limpo (a barra escura da foto e o "Gabriela S" solto foram
 * apagados), e a 38px de altura ele se comporta. Mas rubrica é identidade, vai
 * em toda página e um dia vai precisar escalar: o SVG continua pedido à
 * Catherine. Ver docs/10 §5, item 9.
 */
export function Nav() {
  const t = useTranslations('nav')
  const rubrica = dadosDaImagem('/marca/rubrica.png')

  const abas = [
    { href: '/a-artista', rotulo: t('sobre') },
    { href: '/ensaios', rotulo: t('textos') },
    { href: '/contato', rotulo: t('contato') },
  ] as const

  return (
    <header className="px-[var(--margem-lateral)] pt-8 pb-4 md:pt-10">
      {/* Mobile primeiro: marca em uma linha, navegação na seguinte. */}
      <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-x-8">
        <Link href="/" className="block w-fit transition-opacity hover:opacity-60">
          {rubrica ? (
            <Image
              src="/marca/rubrica.png"
              /* O nome dela, e não "rubrica de": este é o link para a home, e o
                 nome acessível de um logo é o nome do site. Some em português
                 e em inglês porque nome próprio não traduz. */
              alt="Gabriela Seleme"
              width={rubrica.largura}
              height={rubrica.altura}
              priority
              className="h-[34px] w-auto md:h-[38px]"
            />
          ) : (
            /* A rubrica não é opcional (G1), mas cabeçalho sem nome nenhum é
               pior do que o wordmark: se o manifesto de imagens não tiver o
               arquivo, o nome volta em vez de a marca sumir. */
            <span className="font-display text-[1.35rem] leading-none tracking-[0.02em] md:text-[1.6rem]">
              Gabriela Seleme
            </span>
          )}
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
