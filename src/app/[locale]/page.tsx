import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { dadosDaImagem, lerObras } from '@/lib/obras'
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
 * DESDE 05/10 (docs/13) a home segue a ordem da referência, a Kelly Wearstler,
 * bloco por bloco — a pedido do Guilherme, "muito igual à referência":
 *
 *   1. a entrada: o filme em tela cheia, com a chamada na base (Entrada.tsx)
 *   2. a fileira de cartões: as três obras lado a lado, título em caixa alta
 *      larga e o ano embaixo, em serifada — na referência são as categorias
 *      da loja
 *   3. os dois painéis de altura inteira: A artista e Contato — na referência
 *      são as campanhas
 *   4. o rodapé escuro com a marca grande (Rodape.tsx)
 *
 * O que continua valendo da revisão dela de 27/08 (docs/08 §2):
 *
 *   H1  a lista índice "01 Encontro / 02 / 03" — não volta: os cartões não são
 *       lista numerada, são as fotos
 *   H2  as imagens de estudo do ateliê — não voltam
 *   H3  os blocos de legenda ("Uma linha sobre a obra…") — não voltam
 *   H4  cada obra com UMA foto só, limpa, apenas a obra, na proporção em que
 *       foi feita (9:16): recortar cortaria a franja de Instante e as pontas
 *       de Desabrochar
 *   H5  hover na foto → o vídeo da obra passa no lugar (VideoAoPassar)
 *   H6  clique → a página da obra
 *
 * A nota ("Em exposição na…"), pedida em 08/09 para "a aba principal das
 * peças", sobe para a chamada da entrada quando é a mesma nas três — é a linha
 * em serifada que a referência põe sob o título.
 */
export default async function Portfolio({ params }: { params: Promise<{ locale: Idioma }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('portfolio')
  const te = await getTranslations('entrada')
  const tn = await getTranslations('nav')
  const ts = await getTranslations('sobre')
  const obras = lerObras()
  const retrato = dadosDaImagem('/sobre/retrato.jpg')
  const rosto = dadosDaImagem('/sobre/rosto.jpg')

  // Se as três peças têm a MESMA nota, ela é dita uma vez, na entrada.
  const notas = obras.map((o) => localizar(o.nota, locale))
  const notaComum =
    notas.length > 1 && notas.every((n) => n && n === notas[0]) ? notas[0] : null

  const paineis = [
    {
      href: '/a-artista' as const,
      titulo: tn('sobre'),
      link: t('conhecer'),
      foto: retrato && { src: '/sobre/retrato.jpg', alt: ts('retratoAlt'), ...retrato },
    },
    {
      href: '/contato' as const,
      titulo: tn('contato'),
      link: t('consultar'),
      foto: rosto && { src: '/sobre/rosto.jpg', alt: ts('rostoAlt'), ...rosto },
    },
  ]

  return (
    <>
      {/* A home é o portfólio: é aqui que a Person da Gabriela é declarada
          (item 22). É o que habilita painel de conhecimento. */}
      <DadosEstruturados json={grafo(pessoa(locale))} />

      <h1 className="sr-only">{t('titulo')}</h1>

      <Entrada
        titulos={obras.map((o) => o.titulo)}
        nota={notaComum}
        rotuloLink={te('verObras')}
      />

      {/* 2. A fileira de cartões. No celular, um trilho que corre de lado com o
          dedo (scroll-snap, sem JS), como na referência. */}
      <section id="obras" aria-label={t('titulo')} className="cartoes">
        <ul className="cartoes__trilho">
          {obras.map((obra) => {
            const principal = obra.imagens.find((im) => im.papel === 'principal')
            const nota = notaComum ? null : localizar(obra.nota, locale)
            const href = { pathname: '/obras/[slug]', params: { slug: obra.slug } } as const

            return (
              <li key={obra.slug} data-obra className="cartao">
                <Link href={href} className="cartao__link">
                  <span className="cartao__quadro revelar">
                    <ImagemObra
                      src={principal?.src ?? ''}
                      alt={localizar(principal?.alt, locale)}
                      titulo={obra.titulo}
                      // SEM prioridade: o LCP da home é o pôster da entrada.
                      // Valor fixo, não var(): `sizes` é lido fora da cascata.
                      sizes="(max-width: 768px) 76vw, 26vw"
                    />
                    {obra.video?.src && (
                      <VideoAoPassar mp4={obra.video.src} webm={obra.video.webm} />
                    )}
                  </span>
                  <span className="cartao__legenda">
                    <span className="titulo-largo cartao__titulo">{obra.titulo}</span>
                    {typeof obra.ano === 'number' && <span className="cartao__ano">{obra.ano}</span>}
                    {nota && <span className="cartao__ano">{nota}</span>}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 3. Os dois painéis de altura inteira. */}
      <section className="paineis">
        {paineis.map((painel) => (
          <Link key={painel.href} href={painel.href} className="painel">
            {painel.foto && (
              <Image
                src={painel.foto.src}
                alt=""
                width={painel.foto.largura}
                height={painel.foto.altura}
                placeholder="blur"
                blurDataURL={painel.foto.lqip}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="painel__foto"
              />
            )}
            <span className="painel__texto">
              <span className="titulo-largo painel__titulo">{painel.titulo}</span>
              <span className="link-italico">{painel.link}</span>
            </span>
          </Link>
        ))}
      </section>
    </>
  )
}
