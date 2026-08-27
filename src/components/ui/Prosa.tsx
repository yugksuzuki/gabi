import type { ReactNode } from 'react'

/**
 * O texto autoral, renderizado como ela escreveu.
 *
 * Vivia duplicado em duas páginas (a bio e o texto de obra) e ia para uma
 * terceira com a área editorial. Uma cópia só, então, antes que as três
 * divirjam e o mesmo parágrafo apareça com ritmo diferente em cada página.
 *
 * ## Por que não é MDX
 *
 * O item 11 do Stack Técnico diz "MDX". Os arquivos continuam `.mdx` e o
 * frontmatter continua igual, mas o corpo é renderizado por este componente, de
 * 40 linhas, em vez de por um compilador.
 *
 * O que MDX acrescentaria é JSX dentro do texto. Ninguém escreve JSX aqui: quem
 * escreve é a Gabriela, num editor, em prosa. O que ele acrescentaria de fato é
 * uma dependência, uma etapa de compilação por arquivo e a possibilidade de um
 * texto derrubar o build por um caractere. CLAUDE.md pede que toda dependência
 * justifique a própria existência, e esta não justifica hoje.
 *
 * Trocar depois é contido: este componente é a única porta. Se algum dia um
 * texto precisar de componente embutido, entra o compilador aqui dentro e
 * nenhuma página muda.
 *
 * ## O que ele preserva, e por que cada coisa
 *
 * **Quebra de linha simples.** "Esse caminho, / Essas peças, / São um reflexo de
 * transformação, / De desenvolvimento." são QUATRO linhas na folha que ela
 * escreveu, não uma frase corrida. Achatar isso reescreve o ritmo dela.
 *
 * **Negrito e itálico.** Na folha da bio existe exatamente uma palavra em
 * negrito: **expressão**. Uma palavra, e ela escolheu qual.
 *
 * **Citação.** `> ` vira `<blockquote>`. É o que permite citar curadoria ou
 * imprensa — a única forma pela qual a regra 1 admite a palavra "artista" no
 * site: dita por terceiro, nunca na primeira pessoa.
 *
 * Só isso. Sem tabela, sem lista, sem imagem no meio do texto: nada disso
 * aparece no material dela, e inventar estrutura para conteúdo que não existe é
 * o caminho mais curto para uma página que não parece galeria.
 */
export function Prosa({
  texto,
  className,
  lang,
}: {
  texto: string
  className?: string
  /** Marca o idioma quando o corpo está numa língua diferente da página. */
  lang?: string
}) {
  const blocos = texto.trim().split(/\n{2,}/)

  return (
    <div
      {...(lang ? { lang } : {})}
      className={className ?? 'max-w-[var(--medida-corpo)] text-corpo'}
    >
      {blocos.map((bloco, i) => {
        if (bloco.startsWith('> ')) {
          const citacao = bloco
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join('\n')
          return (
            <blockquote
              key={i}
              className="border-line-forte text-ink-muted my-8 border-l pl-6 italic"
            >
              {linhas(citacao)}
            </blockquote>
          )
        }
        return (
          <p key={i} className="mb-6 last:mb-0">
            {linhas(bloco)}
          </p>
        )
      })}
    </div>
  )
}

function linhas(bloco: string): ReactNode {
  return bloco.split('\n').map((linha, i, todas) => (
    <span key={i}>
      {enfase(linha)}
      {i < todas.length - 1 && <br />}
    </span>
  ))
}

/** `**negrito**` e `*itálico*`. Nesta ordem: o negrito é dois asteriscos. */
function enfase(texto: string): ReactNode {
  return texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((parte, i) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return (
        <strong key={i} className="font-medium">
          {parte.slice(2, -2)}
        </strong>
      )
    }
    if (parte.startsWith('*') && parte.endsWith('*') && parte.length > 2) {
      return <em key={i}>{parte.slice(1, -1)}</em>
    }
    return <span key={i}>{parte}</span>
  })
}
