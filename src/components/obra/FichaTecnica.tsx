import { useTranslations } from 'next-intl'
import { ehPendente, type Obra } from '@/lib/obras'
import { localizar } from '@/lib/localizar'
import { Pendente } from '@/components/ui/Pendente'
import type { Idioma } from '@/i18n/routing'

/**
 * A ficha como ELA faz — O6 e O7 da revisão de 27/08.
 *
 * A tabela com coluna de rótulos foi riscada, e o áudio foi literal: "não
 * precisa ter tipo assim, nome tananã. Acho que pode ser só organizado do
 * jeito que tá naquele pdfzinho". O pdfzinho é a folha de cada obra:
 *
 *   Gabriela Seleme
 *   Encontro, 2026
 *   Gesso e massa acrílica sobre tela 115x180
 *
 * Três linhas, o nome da obra em itálico, técnica e medida juntas, sem rótulo,
 * sem filete. A medida sai como ela escreveu (`medidaNaFicha`); na falta dela,
 * do dado estruturado.
 */
export function FichaTecnica({ obra, idioma }: { obra: Obra; idioma: Idioma }) {
  const t = useTranslations('obra')

  const tecnica = localizar(obra.tecnica, idioma)
  const medida = obra.medidaNaFicha ?? formatarDimensoes(obra.dimensoes)

  return (
    <section aria-labelledby="ficha" className="text-corpo leading-[1.55]">
      <h2 id="ficha" className="sr-only">
        {t('fichaTecnica')}
      </h2>
      <p>Gabriela Seleme</p>
      <p>
        <em>{obra.titulo}</em>, {ehPendente(obra.ano) ? <Pendente campo="ano" /> : obra.ano}
      </p>
      <p>
        {tecnica ?? <Pendente campo="tecnica" />} {medida ?? <Pendente campo="dimensoes" />}
      </p>
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
