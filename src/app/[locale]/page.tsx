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
 * O que sobra é a obra e o nome dela, uma por tela, alternando de lado — para
 * que três leiam como percurso de galeria e não como grade à espera de mais
 * (redesenho de 05/10, docs/12).
 * A foto vai na proporção em que foi feita (9:16): recortar para caber num
 * molde uniforme cortaria a franja de Instante e as pontas de Desabrochar.
 *
 * A nota ("Em exposição na…") fica: foi pedida DEPOIS da revisão, em 08/09, e
 * justamente para "a aba principal das peças". Quando é a mesma nas três, vai
 * uma vez só, antes da sequência.
 */
export default async function Portfolio({ params }: { params: Promise<{ locale: Idioma }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('portfolio')
  const obras = lerObras()

  // Se as três peças têm a MESMA nota, ela é dita uma vez, antes da sequência.
  const notas = obras.map((o) => localizar(o.nota, locale))
  const notaComum =
    notas.length > 1 && notas.every((n) => n && n === notas[0]) ? notas[0] : null

  return (
    <>
      {/* A home é o portfólio: é aqui que a Person da Gabriela é declarada
          (item 22). É o que habilita painel de conhecimento. */}
      <DadosEstruturados json={grafo(pessoa(locale))} />

      <h1 className="sr-only">{t('titulo')}</h1>

      <Entrada />

      <div className="flex flex-col gap-[var(--respiro-secao)] py-[var(--respiro-secao)]">
        {/* A nota dita uma vez. Hoje as três peças estão na mesma galeria, e a
            mesma linha embaixo de cada uma lia como carimbo repetido. Quando
            as notas forem diferentes, cada peça volta a mostrar a sua. */}
        {notaComum && (
          <p className="legenda -mb-[calc(var(--respiro-secao)/2)] px-[var(--margem-lateral)]">
            {notaComum}
          </p>
        )}

        {obras.map((obra, i) => {
          const principal = obra.imagens.find((im) => im.papel === 'principal')
          const nota = notaComum ? null : localizar(obra.nota, locale)
          const aDireita = i % 2 === 1
          const href = { pathname: '/obras/[slug]', params: { slug: obra.slug } } as const

          // Uma obra por tela. No celular a foto sangra de borda a borda — a
          // proporção dela (9:16) é a da tela, e é assim que a referência abre
          // cada peça. Na tela larga a foto vai à altura da tela (globals.css,
          // .obra-quadro) e o nome entra grande ao lado dela, na base,
          // alternando de lado de uma peça para a outra. O escalonamento
          // que havia antes (cada peça subindo 30vh para dentro da anterior)
          // saiu — com a foto à altura da tela, ele punha duas obras disputando
          // a mesma tela, e a proposta é uma de cada vez.
          return (
            <article
              key={obra.slug}
              data-obra
              className={[
                'flex flex-col gap-6 md:items-end md:gap-16 md:px-[var(--margem-lateral)]',
                aDireita ? 'md:flex-row-reverse' : 'md:flex-row',
              ].join(' ')}
            >
              {/* Só a FOTO se revela na rolagem. O nome e a nota nunca passam
                  por transparência: docs/02 §5 proíbe animação que atrase a
                  leitura do nome da obra — e texto a meio caminho do fade
                  reprova no contraste AA. */}
              <Link href={href} className="obra-quadro revelar md:shrink-0">
                <ImagemObra
                  src={principal?.src ?? ''}
                  alt={localizar(principal?.alt, locale)}
                  titulo={obra.titulo}
                  // SEM prioridade, nem na primeira. O LCP da home é o pôster
                  // da entrada (Entrada.tsx), não esta foto — e com a entrada
                  // em tela cheia no celular ela nem encosta na primeira tela.
                  // Com `prioridade` ela ganhava um preload no <head> e
                  // disputava banda com o pôster (docs/11 §3).
                  // Valor fixo, não var(): `sizes` é lido fora da cascata e
                  // não resolve custom property.
                  sizes="(max-width: 768px) 100vw, 34vw"
                />
                {obra.video?.src && (
                  <VideoAoPassar mp4={obra.video.src} webm={obra.video.webm} />
                )}
              </Link>

              {/* O nome encosta na obra, na base, como etiqueta de parede — e
                  do lado de dentro da página, para onde o olho vai depois. */}
              <div
                className={[
                  'px-[var(--margem-lateral)] md:px-0 md:pb-2',
                  aDireita ? 'md:text-right' : '',
                ].join(' ')}
              >
                <h2 className="font-display text-display leading-[1]">
                  <Link href={href} className="transition-opacity hover:opacity-60">
                    {obra.titulo}
                  </Link>
                </h2>
                {/* Nota da peça — pedido dela em 08/09. Some sozinha quando a
                    peça não tem nota, ou quando é a mesma das outras. */}
                {nota && <p className="legenda mt-3">{nota}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
