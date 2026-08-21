import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Link, redirect, usePathname e useRouter cientes das rotas localizadas.
 *
 * usePathname devolve o caminho INTERNO ('/obras/encontro'), não o visível.
 * É isso que faz a troca de idioma preservar a página em vez de cair na home:
 * quem está em /pt/obras/instante vai para /en/works/instante.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
