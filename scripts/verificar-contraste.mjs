/**
 * Lê src/styles/tokens.css e verifica os pares de contraste que a WCAG 2.1 AA
 * exige (docs/01 §5, item 39 do Stack Técnico: "AA é promessa escrita").
 *
 * Não é enfeite: roda no CI e falha o build. Se alguém ajustar um token e
 * quebrar o mínimo, o erro aparece aqui e não numa auditoria seis meses depois.
 */
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')

/** Extrai `--nome: #rrggbb;` do :root. */
function lerTokens(fonte) {
  const tokens = {}
  for (const [, nome, valor] of fonte.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[nome] = valor.slice(1).toLowerCase()
  }
  return tokens
}

const canal = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

const luminancia = (hex) => {
  const [r, g, b] = hex.match(/\w\w/g).map((h) => parseInt(h, 16))
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}

const contraste = (a, b) => {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

const t = lerTokens(css)

/**
 * `--line` não está aqui de propósito: é filete decorativo de baixíssimo
 * contraste por decisão de projeto, e a 1.4.11 isenta elemento puramente
 * decorativo. Borda de controle usa `--line-forte`, que está.
 */
const pares = [
  ['texto', 'ink', 'bg', 4.5],
  ['texto', 'ink', 'bg-alt', 4.5],
  ['texto', 'ink-muted', 'bg', 4.5],
  ['texto', 'ink-muted', 'bg-alt', 4.5],
  ['interface', 'line-forte', 'bg', 3],
  ['interface', 'line-forte', 'bg-alt', 3],
]

let falhou = false
console.log('Contraste WCAG 2.1 AA — src/styles/tokens.css\n')

for (const [tipo, frente, fundo, minimo] of pares) {
  if (!t[frente] || !t[fundo]) {
    console.error(`  ERRO   token ausente: --${frente} ou --${fundo}`)
    falhou = true
    continue
  }
  const razao = contraste(t[frente], t[fundo])
  const passa = razao >= minimo
  if (!passa) falhou = true
  const rotulo = `${frente} sobre ${fundo}`
  console.log(
    `  ${passa ? 'ok  ' : 'FALHA'}  ${rotulo.padEnd(26)} ${razao.toFixed(2)}:1` +
      `   mín ${minimo.toFixed(1)} (${tipo})`
  )
}

if (t.line && t.bg) {
  console.log(
    `\n  --line sobre --bg: ${contraste(t.line, t.bg).toFixed(2)}:1 ` +
      `— filete decorativo, isento (WCAG 1.4.11)`
  )
}

if (falhou) {
  console.error('\nContraste abaixo do mínimo AA. Ajuste o token ou o par.')
  process.exit(1)
}
console.log('\nTodos os pares passam o AA.')
