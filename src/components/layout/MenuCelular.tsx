'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import contato from '@/lib/contato'

type Aba = { href: '/' | '/a-artista' | '/ensaios' | '/contato'; rotulo: string }

/**
 * O menu do celular, no desenho da referência: o ícone de duas linhas à
 * esquerda, a marca no centro, e o menu abrindo em tela cheia.
 *
 * É um <details>: abre e fecha sem JavaScript, com teclado e leitor de tela,
 * de graça. O JS só acrescenta duas coisas que o <details> não sabe fazer
 * sozinho — fechar quando a página muda (o cabeçalho não é recriado na
 * navegação, então ele ficaria aberto por cima da página nova) e fechar no Esc.
 */
export function MenuCelular({ abas }: { abas: Aba[] }) {
  const t = useTranslations('nav')
  const ref = useRef<HTMLDetailsElement>(null)
  const caminho = usePathname()

  useEffect(() => {
    if (ref.current) ref.current.open = false
  }, [caminho])

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ref.current?.open) {
        ref.current.open = false
        ref.current.querySelector('summary')?.focus()
      }
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [])

  return (
    <details ref={ref} className="menu-celular md:hidden">
      <summary className="menu-celular__botao" aria-label={t('menu')}>
        <span aria-hidden="true" className="menu-celular__icone" />
      </summary>
      <div className="menu-celular__painel">
        <nav aria-label={t('rotulo')}>
          <ul className="flex flex-col gap-5">
            {abas.map((aba) => (
              <li key={aba.href}>
                <Link href={aba.href} className="menu-celular__link">
                  {aba.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="menu-celular__rodape">
          <li>
            <a href={`mailto:${contato.email}`}>{contato.email}</a>
          </li>
          <li>
            <a href={contato.instagramUrl} rel="noopener noreferrer me" target="_blank">
              @{contato.instagram}
            </a>
          </li>
        </ul>
      </div>
    </details>
  )
}
