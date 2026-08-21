import { useTranslations } from 'next-intl'
import { ehPendente, type Obra } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { Pendente } from '@/components/ui/Pendente'
import type { Idioma } from '@/i18n/routing'

/**
 * Diagramada como REGISTRO DE MUSEU, não como especificação de produto
 * (checklist docs/02 §8). Rótulo pequeno em versalete, valor em corpo,
 * filete de baixíssimo contraste entre as linhas. Nada de tabela de e-commerce.
 */
export function FichaTecnica({ obra, idioma }: { obra: Obra; idioma: Idioma }) {
  const t = useTranslations('obra')

  const dimensoes = formatarDimensoes(obra.dimensoes)
  const linhas: { rotulo: string; valor: string | null; campo: string }[] = [
    { rotulo: t('ano'), valor: ehPendente(obra.ano) ? null : String(obra.ano), campo: 'ano' },
    { rotulo: t('tecnica'), valor: localizar(obra.tecnica, idioma), campo: 'técnica' },
    { rotulo: t('dimensoes'), valor: dimensoes, campo: 'dimensões' },
    { rotulo: t('materiais'), valor: localizar(obra.materiais, idioma), campo: 'materiais' },
    { rotulo: t('edicao'), valor: localizar(obra.edicao, idioma), campo: 'edição' },
    {
      rotulo: t('disponibilidade'),
      valor: ehPendente(obra.disponibilidade)
        ? null
        : t(obra.disponibilidade as 'disponivel' | 'reservada' | 'vendida' | 'acervo'),
      campo: 'disponibilidade',
    },
  ]

  return (
    <section aria-labelledby="ficha" className="max-w-[46ch]">
      <h2 id="ficha" className="legenda mb-5">
        {t('fichaTecnica')}
      </h2>
      <dl className="border-line border-t">
        {linhas.map(({ rotulo, valor, campo }) => (
          <div
            key={campo}
            className="border-line grid grid-cols-[9rem_1fr] gap-x-4 border-b py-3"
          >
            <dt className="legenda pt-0.5">{rotulo}</dt>
            <dd className="text-corpo leading-snug">
              {valor ?? <Pendente campo={campo} />}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function formatarDimensoes(d: Obra['dimensoes']): string | null {
  if (!d || ehPendente(d) || typeof d !== 'object') return null
  const { altura, largura, profundidade, diametro, unidade } = d
  if (diametro) return `⌀ ${diametro} ${unidade}`
  const lados = [altura, largura, profundidade].filter((n): n is number => typeof n === 'number')
  return lados.length ? `${lados.join(' × ')} ${unidade}` : null
}
