import contato from './contato'
import type { Idioma } from '@/i18n/routing'

/**
 * O botão Consultar — docs/03 §6.
 *
 * Regra 3 do CLAUDE.md: sem carrinho, sem checkout, sem "comprar". O caminho é
 * Portfólio → Obra → Detalhe → Consultar, e Consultar abre uma conversa.
 *
 * O número confirmado mora em src/lib/contato.ts. NEXT_PUBLIC_WHATSAPP tem
 * precedência quando existe — é como se aponta o Consultar para um número de
 * teste em preview sem tocar no código.
 *
 * Fallback digno: se os dois faltarem, ou se o valor não parecer um número de
 * telefone, vira `mailto:` com assunto e corpo equivalentes. O site entra no ar
 * sem o WhatsApp e ninguém percebe falta.
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
  /** Só dígitos, quando o canal é whatsapp. Serve para exibir o número. */
  numero: string | null
}

/**
 * Como um número brasileiro se escreve para uma pessoa LER, não para o wa.me.
 * Fora do padrão brasileiro, devolve `+` seguido dos dígitos — legível, sem
 * fingir que sabe a máscara de um país que não conhece.
 */
export function exibirTelefone(digitos: string): string {
  if (digitos === contato.whatsapp) return contato.whatsappExibicao
  const br = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digitos)
  return br ? `+55 ${br[1]} ${br[2]}-${br[3]}` : `+${digitos}`
}

/**
 * Só dígitos: o wa.me não aceita `+`, espaço nem hífen. Devolve `null` para
 * qualquer coisa que não pareça um telefone — é esse `null` que manda o botão
 * para o `mailto:` em vez de gerar um wa.me quebrado.
 *
 * Exportada para o scripts/verificar-whatsapp.mjs poder cobrir o caminho do
 * fallback, que em produção só acontece se o número sair do contato.ts.
 */
export function normalizarNumero(bruto: string | undefined): string | null {
  if (!bruto) return null
  const digitos = bruto.replace(/\D/g, '')
  // E.164 sem o `+`: 55 + DDD (2) + celular (9) = 13 dígitos no Brasil.
  // Aceita 12 a 15 para não travar número de fora ou fixo.
  return digitos.length >= 12 && digitos.length <= 15 ? digitos : null
}

export function linkDeConsulta(titulo: string, idioma: Idioma): DestinoConsulta {
  const numero =
    normalizarNumero(process.env.NEXT_PUBLIC_WHATSAPP) ?? normalizarNumero(contato.whatsapp)
  const mensagem = mensagens[idioma](titulo)

  if (numero) {
    return {
      href: `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
      canal: 'whatsapp',
      numero,
    }
  }

  const assunto = encodeURIComponent(assuntos[idioma](titulo))
  const corpo = encodeURIComponent(mensagem)
  return {
    href: `mailto:${contato.email}?subject=${assunto}&body=${corpo}`,
    canal: 'email',
    numero: null,
  }
}
