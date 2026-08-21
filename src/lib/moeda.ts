import type { Idioma } from '@/i18n/routing'

/**
 * precoBRL é a fonte única; USD é sempre derivado (docs/03 §5).
 *
 * Guardar os dois é garantir que um dia divergem. A cotação é PTAX do Banco
 * Central — pública e auditável — e o inglês SEMPRE marca "approx.", porque o
 * valor é informativo: frete, seguro e imposto são caso a caso.
 */

const PTAX =
  'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/' +
  "CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='%s'&$top=1&$format=json&$select=cotacaoVenda"

export type Cotacao = { valor: number; data: string } | null

/** dd-MM-yyyy, como a API do BC espera. */
function formatarData(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}-${p(d.getDate())}-${d.getFullYear()}`
}

/**
 * Busca a última cotação disponível. O PTAX não publica em fim de semana nem
 * feriado, então volta até 7 dias antes de desistir.
 *
 * Fallback obrigatório: qualquer falha devolve `null`, e quem chama mostra só
 * o BRL. Nunca cotação velha sem aviso, nunca página quebrada.
 */
export async function buscarCotacaoUSD(): Promise<Cotacao> {
  for (let i = 0; i < 7; i++) {
    const dia = new Date()
    dia.setDate(dia.getDate() - i)
    try {
      const resposta = await fetch(PTAX.replace('%s', formatarData(dia)), {
        // ISR: uma vez por dia basta. Cotação de arte não é day trade.
        next: { revalidate: 86400 },
      })
      if (!resposta.ok) continue
      const json = (await resposta.json()) as { value?: { cotacaoVenda?: number }[] }
      const valor = json.value?.[0]?.cotacaoVenda
      if (typeof valor === 'number' && valor > 0) {
        return { valor, data: dia.toISOString().slice(0, 10) }
      }
    } catch {
      // Rede fora, BC fora, resposta estranha: cai no fallback.
    }
  }
  return null
}

export function formatarBRL(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valor)
}

export function formatarUSD(valorBRL: number, cotacao: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(valorBRL / cotacao)
}

/**
 * O que aparece na página. Em EN, com cotação: "R$ 11.230 (approx. $2,100)".
 * Sem cotação: só o BRL, nos dois idiomas.
 */
export function exibirPreco(
  precoBRL: number | null,
  idioma: Idioma,
  cotacao: Cotacao
): string | null {
  if (precoBRL == null) return null
  const brl = formatarBRL(precoBRL)
  if (idioma === 'pt' || !cotacao) return brl
  return `${brl} (approx. ${formatarUSD(precoBRL, cotacao.valor)})`
}
