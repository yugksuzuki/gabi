import { entrada } from '@/lib/entrada'
import { BotaoPausa } from './BotaoPausa'

/**
 * A entrada da home — docs/01 §1 e docs/02 §1: "A home abre em vídeo."
 *
 * O que a Gabriela elogiou na Kelly Wearstler (áudio 03/09/24) não foi o site
 * inteiro, foi a entrada: um vídeo dela montando uma mesa, apresentando a
 * coleção. É isso que este bloco é — o filme dela trabalhando a lã, em tela
 * cheia nos dois tamanhos, com o menu por cima (src/lib/entrada.ts).
 *
 * DUAS CAMADAS, e cada uma escolhe o próprio arquivo pelo tamanho da tela:
 *
 * 1. Embaixo, o pôster: um <picture> com o quadro de abertura em paisagem ou em
 *    retrato. É o LCP da página, e por isso é <img> de verdade, no HTML, com
 *    `fetchpriority="high"`: o navegador o descobre na primeira leitura e o
 *    baixa primeiro. O atributo `poster` do <video> não faz isso — ele é
 *    descoberto tarde, com prioridade baixa, e não varia por tela.
 * 2. Por cima, o vídeo, SEM `poster`: até o primeiro quadro chegar ele é
 *    transparente e o pôster aparece através dele. Cada <source> tem `media`,
 *    então o celular baixa só o corte em retrato e o computador só o em
 *    paisagem.
 *
 * SEM JAVASCRIPT. `autoplay muted loop playsinline` é HTML puro — docs/02 §5
 * proíbe efeito que dependa de JS para o conteúdo aparecer. Se o vídeo não
 * tocar (autoplay bloqueado, economia de bateria, formato recusado), o pôster
 * está ali e ninguém vê buraco. Quem pediu menos movimento recebe só o pôster:
 * o vídeo sai por CSS.
 *
 * A altura é fixa em unidades de viewport e as duas camadas ocupam a mesma
 * caixa, então não há salto de layout: CLS ≤ 0,05 é teto de merge.
 *
 * A CHAMADA (05/10, docs/13), no desenho da referência: na base do vídeo, ao
 * centro, o título em caixa alta, uma linha em serifada e o link em itálico.
 * Na Kelly Wearstler é o nome da campanha + "Discover More". Aqui é o nome das
 * três obras, a nota da galeria e "Ver as obras" — tudo conteúdo dela, nada
 * escrito por nós. Até 05/10 a entrada não dizia nada e ninguém sabia que era
 * para rolar.
 *
 * H7 da revisão de 27/08 ("a logo entra em escrita dinâmica sobre o vídeo")
 * continua: a rubrica se escreve no centro do cabeçalho, que flutua sobre o
 * vídeo (globals.css, "A rubrica se escreve"). Saiu do meio do quadro porque
 * na referência o meio do quadro é do filme.
 *
 * O vídeo é decorativo (aria-hidden); a chamada não é — é texto e link reais.
 * O botão de pausa (BotaoPausa) cumpre a WCAG 2.2.2.
 */
export function Entrada({
  titulos,
  nota,
  rotuloLink,
}: {
  titulos: string[]
  nota: string | null
  rotuloLink: string
}) {
  const { retrato, paisagem, aPartirDe } = entrada

  return (
    <section className="entrada">
      <div aria-hidden="true" className="entrada__quadro">
        {/* <img> cru, não next/image: o otimizador do Next não entende <picture>
            com arte diferente por tela, e estes dois arquivos já saem do
            pipeline no tamanho e no formato certos (WebP). */}
        <picture>
          <source
            media={aPartirDe}
            srcSet={paisagem.poster}
            width={paisagem.largura}
            height={paisagem.altura}
          />
          <img
            className="entrada__estatica"
            src={retrato.poster}
            width={retrato.largura}
            height={retrato.altura}
            alt=""
            fetchPriority="high"
          />
        </picture>

        <video
          className="entrada__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          {/* WebM primeiro de propósito. H.264 não é livre: Chromium compilado
              sem codecs proprietários (o padrão em boa parte do Linux) e Firefox
              em sistemas sem o decodificador do SO simplesmente não abrem o mp4 —
              e o <video> não avisa. VP9 cobre esses; o mp4 cobre Safari e iOS,
              que não tocam VP9. Navegador antigo que ignora `media` em <source>
              cai no primeiro que entende: por isso a paisagem vem antes — no
              computador ela é a certa, e no celular antigo o `cover` ainda
              enquadra o centro. */}
          <source media={aPartirDe} src={paisagem.webm} type="video/webm" />
          <source media={aPartirDe} src={paisagem.mp4} type="video/mp4" />
          <source src={retrato.webm} type="video/webm" />
          <source src={retrato.mp4} type="video/mp4" />
        </video>
      </div>

      <div className="entrada__chamada">
        <p className="titulo-largo entrada__titulo">
          {titulos.map((titulo, i) => (
            <span key={titulo}>
              {i > 0 && (
                <span aria-hidden="true" className="entrada__ponto">
                  {' · '}
                </span>
              )}
              <span className="entrada__nome">{titulo}</span>
            </span>
          ))}
        </p>
        {nota && <p className="entrada__nota">{nota}</p>}
        <a href="#obras" className="link-italico">
          {rotuloLink}
        </a>
      </div>

      <BotaoPausa />
    </section>
  )
}
