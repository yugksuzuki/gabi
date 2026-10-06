# A home no desenho da referência — 06 de outubro de 2026

Pedido do Guilherme, depois de ver o site no ar em 05/10: *"tem que ficar MUITO IGUAL à
referência"* (kellywearstler.com). Clonar não entra: o código, as fotos, os textos, o logotipo e
as fontes (Druk Wide e Caslon, licenciadas) são dela. Isso é a regra 5 do `CLAUDE.md` e é
também infração. O que entrou é o **desenho**: a ordem dos blocos, a escala, a hierarquia, o
par tipográfico e o comportamento. Feito com o material e as palavras da Gabriela.

Medido na própria referência, no navegador, a 1440 e a 584px de largura, antes de construir.

## Bloco por bloco

| Referência | Aqui | Onde |
|---|---|---|
| Cabeçalho sobre o vídeo: abas em serifada à esquerda, logo no centro, utilidades à direita | Abas em Cormorant à esquerda, **a rubrica no centro**, PT / EN à direita | `Nav.tsx` |
| Celular: ícone de duas linhas, logo no centro, menu em tela cheia | Igual. O menu é um `<details>`: abre sem JS | `MenuCelular.tsx` |
| Vídeo em tela cheia; na base, ao centro, título em caixa alta larga + linha em serifada + "Discover More" em itálico | O filme dela; **Encontro · Desabrochar · Instante**, "Em exposição na Galeria Caos", **"Ver as obras"** | `Entrada.tsx` |
| Botão de pausa no canto de baixo | Igual, na entrada e nas faixas (WCAG 2.2.2) | `BotaoPausa.tsx` |
| Fileira de 4 cartões (foto, rótulo em caixa alta larga, linha em serifada) | **3 cartões**, um por obra, foto em 9:16, nome e ano. Hover → vídeo da obra (H5). Celular: trilho que corre de lado | `[locale]/page.tsx`, `.cartoes` |
| Dois painéis de altura inteira, lado a lado, título + link em itálico | **A artista** (o retrato) e **Contato** (o rosto), "Conhecer" e "Consultar" | `.paineis` |
| Rodapé escuro: frase grande, colunas com título em caixa alta larga, logo gigante | E-mail e WhatsApp em grande, colunas Obras · Gabriela Seleme · Contato, **a rubrica grande** clara sobre o grafite. Celular: sanfonas com + | `Rodape.tsx` |

**O par tipográfico.** A voz da referência é a grotesca larga e pesada em caixa alta contra a
serifada clássica. A Druk Wide não entra (licenciada); entrou a **Archivo**, SIL OFL, fixada na
largura máxima e no ExtraBold, 10 KB. Só em títulos e rótulos em caixa alta. **Contraria o G4
dela** ("usar Cormorant Garamond") — o Guilherme decidiu sabendo disso. Detalhe em `docs/02`.
Voltar atrás: apontar `--fonte-titulo` para `--fonte-display` em `tokens.css`.

## O que ficou de fora da referência, e por quê

- **Newsletter** no rodapé — fora do escopo da v1 (`CLAUDE.md`). No lugar, o e-mail e o
  WhatsApp dela.
- **Busca e carrinho** no canto direito — sem loja (regra 3). No lugar, PT / EN.
- **Pontinhos do carrossel** no celular — exigiriam JS; o trilho corre com o dedo sem eles.
- **Fotos de ateliê na home** — ela riscou uma por uma em 27/08 (H2).
- **Lista numerada das obras** — ela riscou (H1). Os cartões são as fotos, não um índice.

## O que mudou em relação a 05/10 (`docs/12`)

- "Uma obra por tela" saiu da home: deu lugar aos cartões, como na referência. Cada obra
  continua inteira, na proporção dela.
- A rubrica grande no meio da entrada saiu: H7 continua, agora no cabeçalho — a rubrica se
  escreve no centro, sobre o filme.
- A nota da galeria subiu para a chamada da entrada.

## Legibilidade, medida

Texto claro sobre o filme foi conferido quadro a quadro (2 por segundo, os 23s, nos dois
cortes), com o pior quadro atrás: título **5,1:1**, linha da galeria **5,7:1**, link **6,2:1**.
O primeiro degradê deixava a linha da galeria em 4,1:1 e foi refeito. Nos painéis, sobre as
fotos: **4,6:1** ou mais. Rodapé: texto secundário `--papel-suave` sobre o grafite, **7,2:1**
(entrou em `verificar-contraste.mjs`).

## Verificado

`pnpm verificar` passa. `pnpm testar` **54/54**, axe-core sem violação AA. Sem rolagem lateral
em 390, 768 e 1440. Lighthouse local, mediana de 3: `/pt` 0,97 · LCP 2,4s · CLS 0 (antes 3,3s);
`/en` 0,96 · 2,7s; `/pt/obras/encontro` 0,89 · 3,8s — a obra varia mais de 1s entre rodadas
nesta máquina (`docs/11` §3) e as imagens dela chegam no mesmo tempo de antes.

Capturas em `docs/validacao/referencia-06-10/`.

## Antes de mandar o link para ela

Ela pediu, em 27/08, para ver o desenho antes do código. Duas coisas aqui vão contra o que ela
escreveu e precisam do ok dela: a **fonte larga nos títulos** (G4) e os **nomes sobre/embaixo
das fotos** na home (ela pediu a obra "limpa", H4).
