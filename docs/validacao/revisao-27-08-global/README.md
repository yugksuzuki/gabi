# Revisão de 27/08 — camada global · registro de validação

Aplicação de **G1 a G7** de `docs/08` no código do site, em 10/09/2026. Até aqui a revisão
dela existia só nas pranchas de `public/wireframe/`.

## O que passou a valer

| # | Pedido dela | Como ficou |
|---|---|---|
| G1 | A logo no lugar do nome, "sempre a logo" | `public/marca/rubrica.png` no cabeçalho, 34px no celular e 38px no desktop. O wordmark em Cormorant saiu |
| G2 | "Quem sou eu" → **A artista** | Rótulo e rota: `/pt/sobre` → `/pt/a-artista` |
| G3 | "Textos" → **Ensaios** | Rótulo e rota: `/pt/textos` → `/pt/ensaios` |
| G4 | Tipografia **Cormorant Garamond** | Auto-hospedada, romano e itálico, 26 + 28 KB. A Fraunces (58 KB) saiu |
| G5 | Escala comprimida | Display 104 → **56px**; razão display/corpo 5,5&times; → **2,7&times;** |
| G6 | Texto conceitual à esquerda | Já estava |
| G7 | Mais respiro | Margem 96 → **120px**, seção 160 → **200px**, entrelinha 1,7 → **1,8** |

Os valores de 1440px vêm da prancha que ela aprovou. Os de 390px vêm da prancha de celular,
que baixa o título de 34 para 26px — a mesma proporção aplicada ao display.

**A neutra não sumiu, recuou.** A Cormorant passou a carregar também o corpo do texto; a Inter
ficou com menu, ficha, legenda, preço e Consultar. Texto de artista se lê em serifada.

## O que NÃO entrou, e por quê

**G8 — faixa de vídeo no cabeçalho e no rodapé.** Bloqueado por material. A faixa horizontal
precisa de 16:9 e o vídeo que existe é 9:16, gravado no celular. A prancha dela já traz a
nota, e `src/lib/entrada.ts` já tinha o raciocínio: esticar 9:16 numa faixa de 1440 obriga o
`cover` a ampliar 2&times; e a jogar 70% do quadro fora. Movimento que custa qualidade não
entra (`docs/02` §5).

**`docs/08` §3 a §6** — obra, home, A artista, Ensaios, Contato. É trabalho de página e vem
depois; o global mexe em rota e tipografia, e tudo herda dele.

## Verificado

- `npm run verificar` — tipos, lint, contraste AA, matcher de rotas, moeda, URL, WhatsApp
- `npm run build` — passa
- **44/44 testes**, incluindo axe-core sem violação AA em 9 rotas &times; desktop e celular,
  navegação só por teclado, conteúdo sem JavaScript, e a troca de idioma nas rotas novas
  (`/pt/a-artista` ↔ `/en/about`, `/pt/ensaios` ↔ `/en/writing`)

## Uma correção de rumo registrada

A primeira versão desta mudança renomeou também os pares em inglês, para `/en/the-artist` e
`/en/essays`. Errado: `docs/01` §1 já registrava que os pares em inglês **não mudam** —
"About" e "Writing" são o que essas páginas se chamam em inglês, e o pedido dela foi renomear
as abas **em português**. Revertido antes do commit.

## Capturas

390 / 768 / 1440, `prefers-reduced-motion: reduce`, `deviceScaleFactor: 2`.

`portfolio` · `a-artista` · `obra` · `ensaios` · `contato`
