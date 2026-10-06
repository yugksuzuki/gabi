import { faixas } from '@/lib/entrada'
import { BotaoPausa } from './BotaoPausa'

/**
 * Cabeçalho e rodapé dinâmicos — G8 da revisão de 27/08, pedidos página a
 * página em A3 (A artista), C1 e C2 (Contato): "faixa de vídeo, no estilo da
 * entrada da home".
 *
 * Ficou bloqueado de 27/08 a 05/10 por falta de material horizontal. O filme
 * que destravou a entrada (src/lib/entrada.ts) destravou isto também: as duas
 * faixas são recortes horizontais dele, ~50KB cada.
 *
 * Mesma construção da entrada: o pôster embaixo, como <img>; o vídeo por cima,
 * sem `poster`, transparente até o primeiro quadro. Sem JS, sem som, e parado
 * para quem pediu menos movimento. Na faixa de cima o menu flutua sobre o
 * vídeo, como na home (globals.css).
 *
 * Decorativa: nada que exista só aqui. O botão de pausa é o da entrada
 * (WCAG 2.2.2): o vídeo da faixa também se move sem parar.
 */
export function FaixaVideo({ lugar }: { lugar: 'cabecalho' | 'rodape' }) {
  const faixa = faixas[lugar]

  return (
    <div className={`faixa faixa--${lugar}`}>
      <div aria-hidden="true" className="faixa__quadro">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faixa.poster}
          width={1600}
          height={450}
          alt=""
          // A de baixo fica longe da primeira tela: sem `lazy`, o React
          // pré-carrega o pôster dela no <head>, disputando banda com o LCP.
          loading={lugar === 'rodape' ? 'lazy' : undefined}
        />
        <video autoPlay muted loop playsInline preload="metadata" tabIndex={-1}>
          <source src={faixa.webm} type="video/webm" />
          <source src={faixa.mp4} type="video/mp4" />
        </video>
      </div>
      <BotaoPausa />
    </div>
  )
}
