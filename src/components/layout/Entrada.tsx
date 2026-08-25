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
 * `svh` no celular porque `vh` conta a barra do navegador e corta o quadro.
 *
 * Decorativo: o vídeo é atmosfera, não informação. Nada que exista só aqui.
 * Por isso `aria-hidden` — e por isso o portfólio logo abaixo continua sendo
 * a primeira coisa que um leitor de tela encontra.
 */
export function Entrada() {
  return (
    <div aria-hidden="true" className="entrada">
      <video
        className="entrada__video"
        poster="/entrada/poster.jpg"
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
        <source src="/entrada/entrada.webm" type="video/webm" />
        <source src="/entrada/entrada.mp4" type="video/mp4" />
      </video>

      {/* Quem pediu menos movimento recebe o mesmo quadro, parado. O vídeo sai
          do fluxo por CSS antes de começar a baixar.

          <img> cru de propósito, não next/image: tem que ser BIT A BIT o mesmo
          arquivo que o atributo `poster` acima. O `poster` do <video> não passa
          pelo otimizador do Next, então uma <Image /> aqui geraria uma segunda
          URL — segundo download, e um pisca na troca entre os dois. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="entrada__estatica" src="/entrada/poster.jpg" alt="" />
    </div>
  )
}
