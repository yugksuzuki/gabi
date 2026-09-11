'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * H5 da revisão de 27/08: "hover na foto → começa a passar o vídeo da obra, no
 * lugar da foto".
 *
 * O vídeo fica EMPILHADO sobre a foto, invisível, e só aparece quando começa a
 * tocar de fato (evento `playing`) — antes disso a foto continua ali, então não
 * existe quadro preto nem pisca. Na saída ele some e pausa onde estava.
 *
 * Três modos, decididos no aparelho de quem vê:
 * - mouse: toca ao passar por cima da obra (foto ou nome) ou ao focar pelo teclado
 * - toque (`hover: none`): o celular não tem hover. A prancha de celular que ela
 *   aprovou resolve: "o vídeo toca sozinho, sem som, e o toque abre a obra" —
 *   então toca quando a obra está 60% na tela e pausa quando sai
 * - `prefers-reduced-motion`: nunca toca. A foto fica, que é a obra
 *
 * Peso: `preload="none"`. Nenhum byte de vídeo desce antes da primeira
 * intenção, então os três vídeos não disputam o LCP da home (docs/08 §2).
 *
 * Decorativo: o vídeo repete a obra que a foto já mostra. A foto carrega o alt.
 */
export function VideoAoPassar({ mp4, webm }: { mp4: string; webm?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [tocando, setTocando] = useState(false)

  useEffect(() => {
    const video = ref.current
    const obra = video?.closest<HTMLElement>('[data-obra]')
    if (!video || !obra) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tocar = () => {
      video.play().catch(() => {})
    }
    const parar = () => {
      video.pause()
      setTocando(false)
    }
    const aoComecar = () => setTocando(true)
    video.addEventListener('playing', aoComecar)

    if (window.matchMedia('(hover: none)').matches) {
      const observador = new IntersectionObserver(
        ([e]) => (e.isIntersecting ? tocar() : parar()),
        { threshold: 0.6 },
      )
      observador.observe(video)
      return () => {
        observador.disconnect()
        video.removeEventListener('playing', aoComecar)
      }
    }

    obra.addEventListener('pointerenter', tocar)
    obra.addEventListener('pointerleave', parar)
    obra.addEventListener('focusin', tocar)
    obra.addEventListener('focusout', parar)
    return () => {
      obra.removeEventListener('pointerenter', tocar)
      obra.removeEventListener('pointerleave', parar)
      obra.removeEventListener('focusin', tocar)
      obra.removeEventListener('focusout', parar)
      video.removeEventListener('playing', aoComecar)
    }
  }, [])

  return (
    <video
      ref={ref}
      className={`obra-video${tocando ? ' obra-video--tocando' : ''}`}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* WebM primeiro — mesmo motivo da entrada (src/components/layout/Entrada.tsx). */}
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  )
}
