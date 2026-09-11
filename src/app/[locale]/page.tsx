import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { lerObras } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { ImagemObra } from '@/components/ui/ImagemObra'
import { Entrada } from '@/components/layout/Entrada'
import { VideoAoPassar } from '@/components/portfolio/VideoAoPassar'
import { DadosEstruturados } from '@/components/DadosEstruturados'
import { grafo, pessoa } from '@/lib/schema'
import type { Idioma } from '@/i18n/routing'

/**
 * A home É o portfólio (docs/01 §1). Não existe home separada com "bem-vindo".
 *
 * Desenho da revisão de 27/08 (docs/08 §2), que ela riscou à mão:
 *
 *   H1  a lista índice "01 Encontro / 02 / 03" — saiu
 *   H2  as imagens de estudo do ateliê, uma por uma — saíram
 *   H3  os blocos de legenda + "VER A OBRA →" — saíram
 *   H4  cada obra com UMA foto só, limpa, apenas a obra
 *   H5  hover na foto → o vídeo da obra passa no lugar (VideoAoPassar)
 *   H6  clique → a página da obra
 *
 * O que sobra é a obra e o nome dela. A sequência alterna de lado e se
 * escalona — cada peça começa antes da anterior terminar, do lado oposto — para
 * que três leiam como percurso de galeria e não como grade à espera de mais.
 * A foto vai na proporção em que foi feita (9:16): recortar para caber num
 * molde uniforme cortaria a franja de Instante e as pontas de Desabrochar.
 *
 * A nota ("Em exposição na…") fica: foi pedida DEPOIS da revisão, em 08/09, e
 * justamente para "a aba principal das peças".
 */
export default async function Portfolio({ params }: { params: Promise<{ locale: Idioma }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('portfolio')
  const obras = lerObras()

  return (
    <>
      {/* A home é o portfólio: é aqui que a Person da Gabriela é declarada
          (item 22). É o que habilita painel de conhecimento. */}
      <DadosEstruturados json={grafo(pessoa(locale))} />

      <h1 className="sr-only">{t('titulo')}</h1>

      <Entrada />

      <div className="flex flex-col gap-[var(--respiro-secao)] py-[var(--respiro-secao)]">
        {obras.map((obra, i) => {
          const principal = obra.imagens.find((im) => im.papel === 'principal')
          const nota = localizar(obra.nota, locale)
          const aDireita = i % 2 === 1
          const href = { pathname: '/obras/[slug]', params: { slug: obra.slug } } as const

          return (
            <article key={obra.slug} className="grid grid-cols-12 px-[var(--margem-lateral)]">
              <div
                data-obra
                className={[
                  'col-span-12 flex flex-col gap-5 md:col-span-5',
                  aDireita ? 'md:col-start-8 md:items-end md:text-right' : 'md:col-start-2',
                  // O escalonamento: a peça seguinte sobe para dentro da altura
                  // da anterior, do outro lado. Só em tela larga — no celular
                  // uma coluna é uma coluna.
                  i > 0 ? 'md:-mt-[30vh]' : '',
                ].join(' ')}
              >
                {/* Só a FOTO se revela na rolagem. O nome e a nota nunca passam
                    por transparência: docs/02 §5 proíbe animação que atrase a
                    leitura do nome da obra — e texto a meio caminho do fade
                    reprova no contraste AA. */}
                <Link href={href} className="obra-quadro revelar">
                  <ImagemObra
                    src={principal?.src ?? ''}
                    alt={localizar(principal?.alt, locale)}
                    titulo={obra.titulo}
                    // A primeira obra da sequência é o LCP da home.
                    prioridade={i === 0}
                    // Valor fixo, não var(): `sizes` é lido fora da cascata e
                    // não resolve custom property.
                    sizes="(max-width: 768px) calc(100vw - 2.5rem), 34vw"
                  />
                  {obra.video?.src && <VideoAoPassar mp4={obra.video.src} webm={obra.video.webm} />}
                </Link>

                <div>
                  <h2 className="font-display text-titulo leading-[1.1]">
                    <Link href={href} className="transition-opacity hover:opacity-60">
                      {obra.titulo}
                    </Link>
                  </h2>
                  {/* Nota da peça — pedido dela em 08/09. Some sozinha quando a
                      peça não tem nota. */}
                  {nota && <p className="legenda mt-2">{nota}</p>}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
