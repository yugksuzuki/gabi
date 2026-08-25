import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { lerObras } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { ImagemObra } from '@/components/ui/ImagemObra'
import { Pendente } from '@/components/ui/Pendente'
import { Entrada } from '@/components/layout/Entrada'
import type { Idioma } from '@/i18n/routing'

/**
 * A home É o portfólio (docs/01 §1). Não existe home separada com "bem-vindo".
 *
 * E não é grade: é SEQUÊNCIA EDITORIAL (docs/02 §4). Três cards leem como
 * catálogo vazio; três blocos alternados leem como publicação. É o que faz o
 * acervo de três obras parecer deliberado em vez de inacabado — e escala para
 * oito obras sem refazer a estrutura.
 *
 * A página abre no vídeo de entrada (docs/01 §1: "a primeira coisa que a pessoa
 * vê é o vídeo e, na rolagem, a obra") e só depois entra a sequência.
 *
 * HIERARQUIA POR MATERIAL: obra fotografada ocupa a escala grande; obra ainda
 * sem foto entra estreita, como entrada de catálogo por vir. Duas das três não
 * têm uma única fotografia (docs/06), e dar a elas o mesmo tamanho da que tem
 * transforma a home em "grade de vinte com dezessete buracos" — exatamente o
 * que CLAUDE.md manda evitar. A obra existe na sequência de qualquer jeito;
 * só não finge ter imagem. Quando a foto chegar, ela cresce sozinha.
 */
export default async function Portfolio({
  params,
}: {
  params: Promise<{ locale: Idioma }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('portfolio')
  const obras = lerObras()

  return (
    <>
      <h1 className="sr-only">{t('titulo')}</h1>

      <Entrada />

      <div className="flex flex-col gap-[var(--respiro-secao)] pt-[var(--respiro-secao)]">
        {obras.map((obra, i) => {
          const legenda = localizar(obra.legenda, locale)
          // A `principal` é a que representa a obra na sequência (docs/03 §1).
          const principal = obra.imagens.find((im) => im.papel === 'principal')
          const temFoto = Boolean(principal)
          // Composição alternada: a imagem troca de lado a cada obra, e a
          // escala varia. Nunca a cadência uniforme de uma grade.
          const aEsquerda = i % 2 === 0

          return (
            <article
              key={obra.slug}
              className="grid grid-cols-12 items-center gap-y-8 px-[var(--margem-lateral)]"
            >
              <div
                className={[
                  'col-span-12',
                  // No celular a moldura empilha em largura cheia como tudo,
                  // mas encolhida: uma caixa de 390px de largura para uma obra
                  // que ainda não foi fotografada engole a tela inteira.
                  temFoto ? '' : 'max-w-[58%] md:max-w-none',
                  temFoto
                    ? aEsquerda
                      ? 'md:col-span-7 md:col-start-1'
                      : 'md:col-span-7 md:col-start-6 md:row-start-1'
                    : aEsquerda
                      ? 'md:col-span-4 md:col-start-1'
                      : 'md:col-span-4 md:col-start-9 md:row-start-1',
                  temFoto && i === 1 ? 'lg:col-span-6' : '',
                ].join(' ')}
              >
                <Link
                  href={{ pathname: '/obras/[slug]', params: { slug: obra.slug } }}
                  className="block"
                >
                  <ImagemObra
                    src={principal?.src ?? ''}
                    alt={localizar(principal?.alt, locale)}
                    titulo={obra.titulo}
                    // A primeira obra da sequência é o LCP da home.
                    prioridade={i === 0}
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                </Link>
              </div>

              <div
                className={[
                  'flex flex-col gap-4',
                  'col-span-12',
                  temFoto ? '' : 'md:self-end md:pb-2',
                  temFoto
                    ? aEsquerda
                      ? 'md:col-span-4 md:col-start-9'
                      : 'md:col-span-4 md:col-start-1 md:row-start-1'
                    : aEsquerda
                      ? 'md:col-span-4 md:col-start-6'
                      : 'md:col-span-4 md:col-start-4 md:row-start-1',
                ].join(' ')}
              >
                <h2 className="font-display text-titulo leading-[1.05]">
                  <Link
                    href={{ pathname: '/obras/[slug]', params: { slug: obra.slug } }}
                    className="transition-opacity hover:opacity-60"
                  >
                    {obra.titulo}
                  </Link>
                </h2>

                {legenda ? (
                  <p className="text-ink-muted max-w-[38ch] text-corpo">{legenda}</p>
                ) : (
                  <Pendente campo="legenda" />
                )}

                <Link
                  href={{ pathname: '/obras/[slug]', params: { slug: obra.slug } }}
                  className="legenda hover:text-ink mt-2 w-fit"
                >
                  {t('verObra')} →
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
