import type { Idioma } from '@/i18n/routing'

/**
 * Data de publicação por extenso, no idioma da página. Intl nativo, zero
 * dependência (mesma escolha do item 05 para moeda).
 *
 * `T00:00:00` explícito: `new Date('2026-08-25')` é interpretado como UTC
 * meia-noite e, em qualquer fuso a oeste de Greenwich — o do Brasil, por
 * exemplo —, imprime o dia anterior. Um texto publicado dia 25 aparecendo como
 * 24 é o tipo de erro que ninguém revisa e todo mundo vê.
 */
export function formatarData(iso: string, idioma: Idioma): string {
  const data = new Date(`${iso}T00:00:00`)
  return new Intl.DateTimeFormat(idioma === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(data)
}
