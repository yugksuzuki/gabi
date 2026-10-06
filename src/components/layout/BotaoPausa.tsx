'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'

/**
 * Pausa o vídeo de fundo que está na mesma caixa — a entrada da home e as
 * faixas de A artista e Contato.
 *
 * Não é enfeite: vídeo que se move sozinho por mais de 5 segundos precisa de um
 * jeito de parar (WCAG 2.2.2, nível A). A referência tem o mesmo botão, no
 * mesmo canto. Até 05/10 o site não tinha.
 *
 * Só aparece depois que o JavaScript carrega: sem ele o botão não faria nada, e
 * um controle que não funciona é pior do que nenhum. Quem pediu menos movimento
 * não vê o vídeo (globals.css) e não vê o botão.
 */
export function BotaoPausa() {
  const t = useTranslations('entrada')
  const ref = useRef<HTMLButtonElement>(null)
  // Verdadeiro só no navegador, depois da hidratação; falso no HTML do build.
  const pronto = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [pausado, setPausado] = useState(false)

  const video = () => ref.current?.parentElement?.querySelector('video') ?? null

  function alternar() {
    const v = video()
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setPausado(false)
    } else {
      v.pause()
      setPausado(true)
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      hidden={!pronto}
      onClick={alternar}
      aria-label={pausado ? t('continuar') : t('pausar')}
      className="botao-pausa"
    >
      {pausado ? (
        <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12">
          <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12">
          <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
