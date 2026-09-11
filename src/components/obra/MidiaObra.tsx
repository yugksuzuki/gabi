'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

type Foto = { src: string; alt: string; largura: number; altura: number; lqip: string }
type Video = { mp4: string; webm?: string; poster?: string }
type Rotulos = {
  midia: string
  ampliar: string
  reduzir: string
  fechar: string
  foto: string
  video: string
  videoDaObra: string
}

const MENOS_MOVIMENTO = '(prefers-reduced-motion: reduce)'

function useMenosMovimento() {
  return useSyncExternalStore(
    (avisar) => {
      const m = window.matchMedia(MENOS_MOVIMENTO)
      m.addEventListener('change', avisar)
      return () => m.removeEventListener('change', avisar)
    },
    () => window.matchMedia(MENOS_MOVIMENTO).matches,
    () => false,
  )
}

/**
 * A obra na página dela — O1, O2 e O4 da revisão de 27/08:
 *
 * > "uma foto da obra com opção de zoom para ampliação da imagem + vídeo da
 * > obra — a transição entre uma coisa e outra em forma de scroll para o lado"
 *
 * UMA foto, não galeria: ela riscou o "DETALHE" e escreveu "substituir por
 * zoom". O detalhe agora é a própria foto, ampliada onde a pessoa apontar.
 *
 * O scroll lateral é NATIVO (`scroll-snap`), não carrossel de biblioteca: rola
 * com trackpad, com o dedo e com as setas do teclado, e sem JavaScript continua
 * rolando. O script só faz o que o CSS não faz — acender o indicador, tocar o
 * vídeo quando ele está à vista e pausar quando sai. A foto seguinte aparece
 * por uma fresta na borda: é ela que diz "tem mais para o lado", sem seta.
 *
 * O zoom é um <dialog> nativo: Esc fecha, o foco volta sozinho para a foto, e o
 * arquivo grande (1800px) só é pedido quando alguém abre.
 */
export function MidiaObra({
  foto,
  video,
  rotulos,
}: {
  foto: Foto
  video: Video | null
  rotulos: Rotulos
}) {
  const trilho = useRef<HTMLDivElement>(null)
  const refVideo = useRef<HTMLVideoElement>(null)
  const dialogo = useRef<HTMLDialogElement>(null)
  const gatilho = useRef<HTMLButtonElement>(null)
  const refAmpliada = useRef<HTMLImageElement>(null)
  const [atual, setAtual] = useState(0)
  const [aberto, setAberto] = useState(false)
  const [ampliada, setAmpliada] = useState(false)
  const [origem, setOrigem] = useState({ x: 50, y: 50 })
  const menosMovimento = useMenosMovimento()

  const slides = video ? [rotulos.foto, rotulos.video] : [rotulos.foto]

  // Qual lado está à vista: acende o indicador e decide se o vídeo toca.
  useEffect(() => {
    const el = trilho.current
    if (!el || !video) return
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const i = Number((e.target as HTMLElement).dataset.indice)
          if (e.isIntersecting) setAtual(i)
          const v = refVideo.current
          if (i !== 1 || !v) continue
          if (e.isIntersecting && !window.matchMedia(MENOS_MOVIMENTO).matches) {
            v.play().catch(() => {})
          } else {
            v.pause()
          }
        }
      },
      { root: el, threshold: 0.6 },
    )
    el.querySelectorAll('[data-indice]').forEach((s) => observador.observe(s))
    return () => observador.disconnect()
  }, [video])

  // O conteúdo do diálogo só existe aberto (a foto de 1800px não desce à toa),
  // então o showModal espera o React desenhar o que vai dentro.
  useEffect(() => {
    if (aberto) dialogo.current?.showModal()
  }, [aberto])

  const irPara = (i: number) => {
    trilho.current?.querySelector(`[data-indice="${i}"]`)?.scrollIntoView({
      behavior: menosMovimento ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }

  // A origem do zoom é o ponto da FOTO sob o cursor, medido na caixa sem
  // transformação (offset*), para que ampliar não mude a própria medida.
  const apontar = (x: number, y: number, palco: HTMLElement) => {
    const img = refAmpliada.current
    if (!img) return
    const r = palco.getBoundingClientRect()
    const px = ((x - r.left - img.offsetLeft) / img.offsetWidth) * 100
    const py = ((y - r.top - img.offsetTop) / img.offsetHeight) * 100
    setOrigem({ x: Math.min(100, Math.max(0, px)), y: Math.min(100, Math.max(0, py)) })
  }

  return (
    <div className="midia">
      <div
        ref={trilho}
        className="midia__trilho"
        role="region"
        aria-label={rotulos.midia}
        tabIndex={video ? 0 : -1}
      >
        <figure className="midia__slide" data-indice={0}>
          <button
            ref={gatilho}
            type="button"
            className="midia__ampliar"
            onClick={() => setAberto(true)}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              width={foto.largura}
              height={foto.altura}
              placeholder="blur"
              blurDataURL={foto.lqip}
              priority
              sizes="(max-width: 1024px) 86vw, 32rem"
            />
            <span className="midia__selo legenda">
              <span aria-hidden="true">+ </span>
              {rotulos.ampliar}
            </span>
          </button>
        </figure>

        {video && (
          <figure className="midia__slide" data-indice={1}>
            <video
              ref={refVideo}
              muted
              loop
              playsInline
              preload="none"
              poster={video.poster}
              controls={menosMovimento}
              aria-label={rotulos.videoDaObra}
            >
              {video.webm && <source src={video.webm} type="video/webm" />}
              <source src={video.mp4} type="video/mp4" />
            </video>
          </figure>
        )}
      </div>

      {video && (
        <div className="midia__controles">
          {slides.map((rotulo, i) => (
            <button
              key={rotulo}
              type="button"
              className="midia__ponto"
              aria-label={rotulo}
              aria-current={atual === i}
              onClick={() => irPara(i)}
            />
          ))}
          <span className="legenda ml-2" aria-live="polite">
            {slides[atual]}
          </span>
        </div>
      )}

      <dialog
        ref={dialogo}
        className="zoom"
        aria-label={foto.alt}
        onClose={() => {
          setAberto(false)
          setAmpliada(false)
          // O <dialog> devolve o foco a quem estava focado ANTES de abrir — e o
          // Safari não foca botão no clique, então esse "quem" pode ser o body.
          // Devolver explicitamente é o que garante voltar para a foto.
          gatilho.current?.focus()
        }}
      >
        {aberto && (
          <>
            <button
              type="button"
              className="zoom__fechar legenda"
              autoFocus
              onClick={() => dialogo.current?.close()}
            >
              {rotulos.fechar} <span aria-hidden="true">×</span>
            </button>
            <button
              type="button"
              className="zoom__palco"
              data-ampliada={ampliada}
              aria-pressed={ampliada}
              aria-label={ampliada ? rotulos.reduzir : rotulos.ampliar}
              onClick={(e) => {
                // Teclado não tem ponto: amplia pelo centro.
                if (!ampliada && e.detail > 0) apontar(e.clientX, e.clientY, e.currentTarget)
                if (!ampliada && e.detail === 0) setOrigem({ x: 50, y: 50 })
                setAmpliada(!ampliada)
              }}
              onPointerMove={(e) => {
                if (ampliada) apontar(e.clientX, e.clientY, e.currentTarget)
              }}
            >
              {/* <img> cru: é o arquivo inteiro, sem variante do otimizador — o
                  ponto de ampliar é ver o pixel que existe. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={refAmpliada}
                src={foto.src}
                alt=""
                draggable={false}
                style={{ transformOrigin: `${origem.x}% ${origem.y}%` }}
              />
            </button>
          </>
        )}
      </dialog>
    </div>
  )
}
