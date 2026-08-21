# Conteúdo real ligado — registro de validação

Fatia de **E3** (página de obra completa) e **E5** (conteúdo real), feita com o
que já existia em `ativos/` e estava parado sem uso.

## O que entrou

| Ativo | Origem | Onde aparece |
|---|---|---|
| `frontal.jpg` | `encontro-frontal.jpg` (IMG_7015) | principal da obra e do portfólio |
| `detalhe.jpg` | `encontro-detalhe.jpg` (IMG_6562) | galeria |
| `escala.jpg` | recortada da prancha de ficha | galeria |
| `retrato.jpg` | recortado da folha da bio | Quem sou eu |
| `rubrica.png` | recortada da folha da bio, fundo transparente | Quem sou eu |

Tudo passa por `npm run imagens` (Sharp + LQIP). Largura, altura e blur vão para
`content/imagens.geradas.json` — dado gerado, fora do frontmatter.

## Duas correções de conteúdo

**Dimensões de Encontro estavam invertidas.** A ficha dela escreve `115x180` sem
dizer qual é qual, e o handoff leu como altura × largura. As duas fotografias
dela mostram a tela **em pé**, e a proporção medida na foto (0,606) bate com
115/180 = 0,639. Corrigido para **180 de altura × 115 de largura**.
**Confirmar com a artista** — é o dado que vai para a ficha e para o JSON-LD.

**As quebras de linha dela estavam sendo achatadas.** Na folha que ela escreveu,
"Esse caminho, / Essas peças, / São um reflexo de transformação, / De
desenvolvimento." são quatro linhas, não uma frase corrida. O mesmo vale para a
prancha de Encontro. Agora a quebra simples é preservada nos dois lugares.

## O que continua pendente, e por quê

- **`tecnica.en` e `legenda.en`** — `docs/03 §4` é explícito: não traduzir
  automaticamente a voz da artista. Encontro segue `rascunho` por isso, e é o
  comportamento certo.
- **3 fotos de ângulo** (IMG_7017/18/19) estão no Drive e não chegaram.
- **Materiais e edição** — a ficha não traz. Não foi inventado.
- **Vetor da rubrica** — o que está no ar é raster recortado da folha. Serve
  para hoje; o original vetorial continua sendo pedido à Catherine.

## Verificado

axe-core sem violação AA em 9 rotas × 390 e 1440px, agora com fotografia real e
`alt` descritivo nos dois idiomas. Contraste, rotas e moeda seguem passando.

O `alt` foi escrito de observação da fotografia, não transcrito dela —
**revisar com a artista** antes de abrir a indexação.
