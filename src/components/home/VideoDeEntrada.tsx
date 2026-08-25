'use client'

import { useEffect, useRef } from 'react'
import type { VideoEntrada } from '@/lib/video-entrada'

/**
 * A entrada da home — o vídeo que ela separou.
 *
 * O que este componente NÃO faz, e por quê:
 *
 * **Não usa `autoplay` no HTML.** O atributo não sabe da pessoa. Com
 * `prefers-reduced-motion: reduce` ligado, um vídeo em laço é exatamente o que
 * o ajuste existe para desligar — e isso é AA, não preferência (docs/01 §5).
 * Então o elemento nasce parado, com o pôster à mostra, e só começa a tocar
 * depois que o JS confirma que pode. Sem JS o pôster fica, e a home continua
 * inteira: "sem JS, o conteúdo está lá" (docs/02 §5).
 *
 * **Não toca com som.** Nunca. `muted` está no elemento e não é opcional; som
 * está fora da v1 (docs/02 §6), e mesmo que entrasse seria com controle
 * visível.
 *
 * **Não baixa nada antes da hora.** `preload="none"`: quem chega pelo Instagram
 * chega no 4G, e o teto de LCP é 2,5s. O pôster é uma imagem; o vídeo só desce
 * depois, e não desce de jeito nenhum se a pessoa pediu economia de dados.
 *
 * **Não escreve nada por cima.** Nem nome, nem título, nem "role para baixo".
 * Regra 1: o site não a intitula, e a obra declara. Um hero com texto por cima
 * do vídeo é o que este projeto não é.
 */
export function VideoDeEntrada({ video }: { video: VideoEntrada }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)')

    type ConexaoEconomica = { saveData?: boolean }
    const conexao = (navigator as Navigator & { connection?: ConexaoEconomica }).connection
    if (conexao?.saveData) return

    const sincronizar = () => {
      if (semMovimento.matches) {
        elemento.pause()
        // Volta ao primeiro quadro: parado no meio parece travado, e o
        // primeiro quadro é o próprio pôster.
        elemento.currentTime = 0
        return
      }
      // O play pode ser recusado (política de autoplay, aba em segundo plano).
      // Recusa não é erro: o pôster continua lá e a home segue igual.
      void elemento.play().catch(() => {})
    }

    sincronizar()
    semMovimento.addEventListener('change', sincronizar)
    return () => semMovimento.removeEventListener('change', sincronizar)
  }, [])

  return (
    <div className="bg-bg-alt relative h-[min(88svh,54rem)] w-full overflow-hidden">
      <video
        ref={ref}
        // Decorativo: o conteúdo da home são as obras, logo abaixo. Um leitor
        // de tela não ganha nada anunciando um vídeo de ambiente sem fala.
        // Se algum dia houver fala, aqui entram legendas — docs/01 §5.
        aria-hidden="true"
        tabIndex={-1}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      >
        <source src={video.src} type="video/mp4" />
      </video>
    </div>
  )
}
