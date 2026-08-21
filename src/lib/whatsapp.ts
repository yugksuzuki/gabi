import contato from './contato'
import type { Idioma } from '@/i18n/routing'

/**
 * O botão Consultar — docs/03 §6.
 *
 * Regra 3 do CLAUDE.md: sem carrinho, sem checkout, sem "comprar". O caminho é
 * Portfólio → Obra → Detalhe → Consultar, e Consultar abre uma conversa.
 *
 * Fallback digno: sem NEXT_PUBLIC_WHATSAPP configurado, vira `mailto:` com
 * assunto e corpo equivalentes. "O site entra no ar sem o WhatsApp e ninguém
 * percebe falta" — e hoje o número ainda não está confirmado.
 */

const mensagens: Record<Idioma, (obra: string) => string> = {
  pt: (obra) =>
    `Olá, Gabriela. Vim pelo site e gostaria de saber mais sobre a obra «${obra}».`,
  en: (obra) =>
    `Hello, Gabriela. I came through your website and would like to know more about "${obra}".`,
}

const assuntos: Record<Idioma, (obra: string) => string> = {
  pt: (obra) => `Consulta sobre a obra «${obra}»`,
  en: (obra) => `Enquiry about "${obra}"`,
}

export type DestinoConsulta = {
  href: string
  canal: 'whatsapp' | 'email'
}

/** Só dígitos: o wa.me não aceita `+`, espaço nem hífen. */
function normalizarNumero(bruto: string | undefined): string | null {
  if (!bruto) return null
  const digitos = bruto.replace(/\D/g, '')
  // E.164 sem o `+`: 55 + DDD (2) + celular (9) = 13 dígitos no Brasil.
  // Aceita 12 a 15 para não travar número de fora ou fixo.
  return digitos.length >= 12 && digitos.length <= 15 ? digitos : null
}

export function linkDeConsulta(titulo: string, idioma: Idioma): DestinoConsulta {
  const numero = normalizarNumero(process.env.NEXT_PUBLIC_WHATSAPP)
  const mensagem = mensagens[idioma](titulo)

  if (numero) {
    return {
      href: `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
      canal: 'whatsapp',
    }
  }

  const assunto = encodeURIComponent(assuntos[idioma](titulo))
  const corpo = encodeURIComponent(mensagem)
  return {
    href: `mailto:${contato.email}?subject=${assunto}&body=${corpo}`,
    canal: 'email',
  }
}
