import { ehPendente } from './obras'
import type { Idioma } from '@/i18n/routing'

/**
 * Extrai o idioma de um campo `Localizado<T>` do frontmatter.
 *
 * Devolve `null` quando o valor é `[PENDENTE]` ou não existe — nunca uma
 * string plausível, nunca um fallback silencioso para o outro idioma. Quem
 * chama decide como mostrar a ausência, e a ausência aparece (regra 2).
 */
export function localizar(valor: unknown, idioma: Idioma): string | null {
  if (valor == null || ehPendente(valor)) return null
  if (typeof valor === 'string') return valor
  if (typeof valor === 'object') {
    const v = (valor as Record<string, unknown>)[idioma]
    if (typeof v === 'string' && !ehPendente(v)) return v
  }
  return null
}
