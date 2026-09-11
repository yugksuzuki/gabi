import { entrada, entradaEhHorizontal } from '@/lib/entrada'
import { dadosDaImagem } from '@/lib/obras'

/**
 * A entrada da home — docs/01 §1 e docs/02 §1: "A home abre em vídeo."
 *
 * O que a Gabriela elogiou na Kelly Wearstler (áudio 03/09/24) não foi o site
 * inteiro, foi a entrada: um vídeo dela montando uma mesa, apresentando a
 * coleção. É isso que este bloco é.
 *
 * SEM JAVASCRIPT. `autoplay muted loop playsinline` é HTML puro — docs/02 §5
 * proíbe efeito que dependa de JS para o conteúdo aparecer. Se o vídeo não
 * tocar (autoplay bloqueado, rede ruim, formato recusado), o `poster` fica no
 * lugar dele e ninguém vê buraco.
 *
 * A altura é fixa em unidades de viewport e o poster tem a mesma proporção do
 * vídeo, então não há salto de layout: CLS ≤ 0,05 é teto de merge (docs/02 §5).
 *
 * H7 da revisão de 27/08: "a logo entra em escrita dinâmica sobre o vídeo".
 * A rubrica se revela da esquerda para a direita, na direção em que a mão
 * escreve — CSS puro, uma vez, e parada para quem pediu menos movimento.
 * É a aproximação possível com o raster: o traço desenhado de verdade, ponto a
 * ponto, precisa do vetor que segue pedido à Catherine (docs/10 §5, item 9 e 10).
 *
 * Decorativo: o vídeo é atmosfera, não informação. Nada que exista só aqui.
 */
export function Entrada() {
  const rubrica = dadosDaImagem('/marca/rubrica.png')

  return (
    <div
      aria-hidden="true"
      className={`entrada ${entradaEhHorizontal ? 'entrada--paisagem' : 'entrada--retrato'}`}
    >
      <div className="entrada__quadro">
        <video
          className="entrada__video"
          poster={entrada.poster}
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
              e o <video> não avisa, só fica no pôster para sempre. VP9 cobre
              esses; o mp4 abaixo cobre Safari e iOS, que não tocam VP9. */}
          <source src={entrada.webm} type="video/webm" />
          <source src={entrada.mp4} type="video/mp4" />
        </video>

        {/* Quem pediu menos movimento recebe o mesmo quadro, parado. O vídeo sai
            do fluxo por CSS antes de começar a baixar.

            <img> cru de propósito, não next/image: tem que ser BIT A BIT o mesmo
            arquivo que o atributo `poster` acima. O `poster` do <video> não passa
            pelo otimizador do Next, então uma <Image /> aqui geraria uma segunda
            URL — segundo download, e um pisca na troca entre os dois. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="entrada__estatica" src={entrada.poster} alt="" />

        {rubrica && (
          <span className="entrada__rubrica">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marca/rubrica.png"
              alt=""
              width={rubrica.largura}
              height={rubrica.altura}
            />
          </span>
        )}
      </div>
    </div>
  )
}
