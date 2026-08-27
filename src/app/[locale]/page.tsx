import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { lerObras } from '@/lib/obras'
import { lerFaixasAtelie } from '@/lib/atelie'
import { localizar } from '@/lib/localizar'
import { ImagemObra } from '@/components/ui/ImagemObra'
import { Pendente } from '@/components/ui/Pendente'
import { Entrada } from '@/components/layout/Entrada'
import { IndiceAcervo } from '@/components/portfolio/IndiceAcervo'
import { FaixaAtelie } from '@/components/portfolio/FaixaAtelie'
import { DadosEstruturados } from '@/components/DadosEstruturados'
import { grafo, pessoa } from '@/lib/schema'
import type { Idioma } from '@/i18n/routing'

/**
 * A home É o portfólio (docs/01 §1). Não existe home separada com "bem-vindo".
 *
 * E não é grade: é SEQUÊNCIA EDITORIAL (docs/02 §4). Três cards leem como
 * catálogo vazio; blocos alternados leem como publicação.
 *
 * DOIS REGISTROS. A página alterna obra e ateliê:
 *
 *   entrada em vídeo → índice do acervo
 *   → obra (contida na margem, cinza-neutro, parede branca)
 *   → ateliê (SANGRANDO de borda a borda, P&B, processo)
 *   → obra → ateliê → obra
 *
 * O site tinha um registro só — obra em parede branca — e por isso lia como
 * inacabado. O que ela elogiou na Kelly Wearstler foi justamente o registro que
 * faltava: o processo. E docs/06 §3 garante que os dois convivem sem briga,
 * porque a fotografia de obra é cinza-neutra e a de ateliê é P&B.
 *
 * Faixa sem imagem não renderiza: `lerFaixasAtelie()` filtra o que não existe
 * no manifesto, então a página continua correta mesmo com a lista vazia.
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
  const faixas = lerFaixasAtelie()

  return (
    <>
      {/* A home é o portfólio: é aqui que a Person da Gabriela é declarada
          (item 22). É o que habilita painel de conhecimento. */}
      <DadosEstruturados json={grafo(pessoa(locale))} />

      <h1 className="sr-only">{t('titulo')}</h1>

      <Entrada />

      <IndiceAcervo obras={obras} />

      <div className="flex flex-col gap-[var(--respiro-secao)] pt-[var(--respiro-secao)]">
        {obras.map((obra, i) => {
          const legenda = localizar(obra.legenda, locale)
          // A `principal` é a que representa a obra na sequência (docs/03 §1).
          const principal = obra.imagens.find((im) => im.papel === 'principal')
          const temFoto = Boolean(principal)
          // Composição alternada: a imagem troca de lado a cada obra, e a
          // escala varia. Nunca a cadência uniforme de uma grade.
          const aEsquerda = i % 2 === 0
          const faixa = faixas.find((f) => f.depoisDe === obra.slug)

          return (
            <div key={obra.slug} className="flex flex-col gap-[var(--respiro-secao)]">
              <article className="grid grid-cols-12 items-center gap-y-8 px-[var(--margem-lateral)]">
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
                        : 'md:col-span-7 md:col-start-6 md:row-start-1 md:flex md:justify-end'
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
                      // A imagem NÃO ocupa 100vw: a sequência tem margem
                      // lateral dos dois lados. Declarar 100vw faz o navegador
                      // escolher um arquivo maior do que vai desenhar, e no
                      // celular isso é o LCP pagando por pixel que ninguém vê.
                      // Valor fixo, não var(): `sizes` é lido fora da cascata
                      // e não resolve custom property.
                      sizes="(max-width: 768px) calc(100vw - 3rem), 58vw"
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
                  <span className="legenda tracking-[0.18em]">
                    {String(i + 1).padStart(2, '0')}
                  </span>

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

                  {/* O filete só aparece no hover: a referência não põe botão
                      sobre a obra, põe uma linha que responde. */}
                  <Link
                    href={{ pathname: '/obras/[slug]', params: { slug: obra.slug } }}
                    className="legenda hover:text-ink hover:border-line-forte mt-2 w-fit border-b border-transparent pb-1 transition-colors"
                  >
                    {t('verObra')} →
                  </Link>
                </div>
              </article>

              {faixa && <FaixaAtelie faixa={faixa} idioma={locale} />}
            </div>
          )
        })}
      </div>
    </>
  )
}
