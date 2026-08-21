import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * Convenção `proxy` do Next 16 (substituiu `middleware`). É o que faz `/`
 * redirecionar por Accept-Language com PT como padrão, e o que traduz a rota
 * visível (/en/works/encontro) para a rota interna (/[locale]/obras/[slug]).
 */
export default createMiddleware(routing)

export const config = {
  // Tudo menos rotas de API, assets do Next e arquivos com extensão.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
