# Alterações pedidas pela Gabriela — 27/08/2026

Fonte: `Gabriela Seleme — Wireframe 3.pdf` (o wireframe do Guilherme devolvido com marcações
à mão, 27/08 14:22) + a lista escrita dela às 14:23 + os complementos de 14:26 e 14:34.

Tudo aqui é pedido dela, na palavra dela. Nada é interpretação de gosto.

> "Achei q ficou confusa a visualização porque nem as fotos correspondem às obras. Mas fiz
> pontuações bem objetivas que acredito serem importantes. Daí me envia o link do Figma
> atualizado com as correções visuais **antes de ir para o VS Code**."

**Isso é uma exigência de processo:** Figma corrigido primeiro, aprovação, só então código.

---

## 1. Global — vale em todas as páginas

| # | Alteração | Origem |
|---|---|---|
| G1 | O wordmark tipográfico "Gabriela Seleme" sai. Entra **a logo** (a rubrica). Na p.2 ela escreveu "**sempre a logo**" — em todas as páginas, não só na home | desenho p.1 e p.2 |
| G2 | Menu: **"Quem sou eu" → "A artista"** | desenho p.1 |
| G3 | Menu: **"Textos" → "Ensaios"** | desenho p.1 |
| G4 | Tipografia: usar **Cormorant Garamond** | lista escrita |
| G5 | **"Não trabalhar com variação tão grande de tamanho de fontes"** — comprimir a escala tipográfica: menos degraus e razão menor entre display e corpo | lista escrita |
| G6 | Textos conceituais **alinhados à esquerda**, nunca centralizados | lista escrita |
| G7 | **Aumentar o respiro** (espaço em branco) em volta de imagens e textos | lista escrita |
| G8 | Cabeçalho e rodapé **dinâmicos** (faixa de vídeo, no estilo da entrada da home) nas páginas internas — ela marcou explicitamente em Contato e pediu em "A artista" | desenho p.7 + lista escrita |

**Consequência de G2/G3:** mudam as rotas. `/pt/sobre` → `/pt/a-artista`, `/pt/textos` →
`/pt/ensaios`, e os pares em EN. Como `robots` ainda está fechado e nada foi indexado, o custo
de trocar agora é zero — depois da estreia seria redirect permanente. **Faça agora.**

**Consequência de G1:** a rubrica em vetor deixou de ser "melhoria" e virou **bloqueio**. Ela
aparece em toda página; raster escalado no cabeçalho vai aparecer. Pedir o SVG à Catherine.

**Consequência de G4/G5:** contradiz `docs/02-direcao-visual.md` §3, que prevê
Fraunces/Instrument Serif e "display muito grande, é o gesto". **A instrução dela vence.**
Atualize o documento junto com o código, senão o próximo passo reintroduz o erro.
Cormorant Garamond é SIL OFL — pode auto-hospedar com `next/font` sem custo nem trava.

---

## 2. Home

| # | Alteração | Origem |
|---|---|---|
| H1 | **Apagar a lista índice** "01 Encontro / 02 Desabrochar / 03 Instante" | rabiscada, p.1 |
| H2 | **Apagar todas as imagens de estudo**: o díptico do ateliê, a foto do mar, a foto da folhagem, a foto do processo. Ela riscou uma por uma | X em cada, p.1 |
| H3 | **Apagar os blocos de legenda** ("Uma linha sobre a obra…" + "VER A OBRA →") sob cada peça | X em cada, p.1 |
| H4 | Cada obra aparece com **uma foto só, limpa, apenas a obra** | lista escrita |
| H5 | **Hover na foto → começa a passar o vídeo da obra**, no lugar da foto | lista escrita |
| H6 | **Clique → página individual daquela obra** | lista escrita |
| H7 | A logo entra **em escrita dinâmica sobre o vídeo de cabeçalho** (assinatura sendo traçada). Ela disse ter mandado o arquivo para a Catherine e que acha que ainda tem | mensagem 14:34 |

**Decisão que sobra para você:** hover não existe em celular, e o celular é a maior parte do
tráfego vindo do Instagram. Opções — vídeo em silêncio ao entrar na viewport, ou toque para
tocar e segundo toque para abrir. Em qualquer caso, `prefers-reduced-motion` desliga.

**Peso:** três vídeos curtos na home contra o teto de LCP 2,5s (que a home **já não passava**,
~3s em 25/08). Vídeo só carrega no hover, `preload="none"`, e o pôster é a própria foto.

---

## 3. Página da obra — a reformulação maior

> "Reformule a visualização para um formato editorial, obra em destaque absoluto, uma foto da
> obra com opção de zoom para ampliação da imagem + vídeo da obra — a transição entre uma coisa
> e outra em forma de scroll para o lado, ficha técnica limpa e canal de aquisição discreto.
> Galeria com imagem à direita, texto e detalhes técnicos à esquerda."

| # | Alteração | Origem |
|---|---|---|
| O1 | **Uma** foto da obra, em destaque absoluto, **com zoom** para ampliar | lista escrita |
| O2 | Foto e vídeo no mesmo lugar, **transição por scroll lateral** entre os dois | lista escrita |
| O3 | Layout: **imagem à direita, texto e ficha à esquerda** | lista escrita |
| O4 | **Apagar a foto de "DETALHE"** — "↳ substituir por zoom" | X + anotação, p.2 |
| O5 | Apagar o par "ESCALA / DETALHE" de imagens soltas | X, p.2 |
| O6 | **Ficha técnica: "seguir exemplo do material disponibilizado"** — a prancha dela, não a tabela de rótulos | X sobre a tabela + anotação, p.2 |
| O7 | Riscar a linha **"Materiais"** da tabela (já está dentro da técnica) | riscado, p.2 |
| O8 | **Tirar o rótulo "VALOR"** | riscado, p.2 |
| O9 | Preço em **cinza, com fonte menor que as demais** | anotação, p.2 |
| O10 | **Consultar deixa de ser botão com caixa** — vira link discreto ("canal de aquisição discreto") | X na caixa + lista escrita |
| O11 | A versão EN da página está riscada inteira: mesmas correções nos dois idiomas | X, p.4 |

**O modelo de ficha que ela quer** é o da prancha que ela mesma diagramou:

```
Gabriela Seleme
Encontro, 2026
Gesso e massa acrílica sobre tela
115 x 180
```

Uma linha por informação, sem coluna de rótulos, sem filete de tabela.

**Confirmar com ela antes de publicar:** a prancha escreve `115x180`, o site mostra
`180 × 115 cm`. Alguém inverteu, e ninguém disse qual é a altura. Também confirmar se
"Peça única" e "Disponível" continuam aparecendo — ela riscou a tabela inteira, e esses dois
campos estavam dentro.

---

## 4. A artista (ex-Quem sou eu)

A página inteira está riscada com um X de ponta a ponta.

| # | Alteração | Origem |
|---|---|---|
| A1 | **"Utilizar diagramação já disponibilizada"** — a diagramação da folha A3 do Canva que ela fez, não a nossa | anotação, p.3 |
| A2 | O título "Quem sou eu" está rabiscado até sumir. Vira **"A artista"** | rabisco, p.3 |
| A3 | Cabeçalho e rodapé com vídeo, no estilo da home | lista escrita |
| A4 | O conteúdo é o mesmo material já fornecido — **o texto dela não muda** | lista escrita |

O texto continua sendo o de `content/sobre.mdx`, transcrito literal. O que muda é o desenho da
página, que passa a seguir a folha dela.

---

## 5. Ensaios (ex-Textos)

A listagem numerada está riscada inteira.

> "Página abre com um texto selecionado já expandido na tela em tipografia editorial, com
> margens largas e espaçamento adequado. À esquerda, um menu slim vertical organizado por data
> (ex: `03.26 — O Acúmulo e o Tempo`, `02.26 — A Matéria como Memória`…)"

| # | Alteração |
|---|---|
| E1 | Nada de listagem com resumo. A página **abre com um ensaio já aberto e expandido** |
| E2 | Tipografia editorial, margens largas, espaçamento generoso |
| E3 | **Menu vertical slim à esquerda**, organizado por data, formato `MM.AA — Título` |
| E4 | Confirmar com ela: *O Acúmulo e o Tempo* e *A Matéria como Memória* são títulos reais ou exemplos inventados para ilustrar? Ela escreveu "ex:" — **não publique como se fossem reais sem confirmar** |

Ela disse em 14:34 que "logo encaminho os textos organizados". Enquanto não chegam, a página
existe com um único ensaio marcado `[PENDENTE]` — nunca com título plausível inventado.

---

## 6. Contato

| # | Alteração | Origem |
|---|---|---|
| C1 | **Cabeçalho dinâmico** (faixa de vídeo no topo) | escrito à mão, p.7 |
| C2 | **Rodapé dinâmico** (faixa de vídeo embaixo) | escrito à mão, p.7 |
| C3 | Mesmo formato da página "A artista" | lista escrita |

Ela não riscou nenhum conteúdo da página — e-mail, Instagram e WhatsApp ficam como estão.

---

## 7. O que ela vai mandar

Prometido por ela em 27/08, ainda não chegou:

1. **As pastas limpas** — "vou deixar nas pastas só a foto q iria e o vídeo, que daí fica mais
   fácil". Resolve a crítica dela de que "nem as fotos correspondem às obras"
2. **Os textos organizados** — os ensaios
3. **O arquivo da logo em escrita dinâmica** — "mandei p cat uma vez mas acho q tenho aqui"

E um item que ela citou e não veio: o último tópico da lista dela é
*"exemplo da opção de exportação do portfólio"* — um exemplo que nunca foi anexado. **Pergunte.**

---

## 8. Buraco neste levantamento

Depois do wireframe anotado ela mandou **três áudios** que não foram transcritos aqui — não
tenho como ouvir arquivo de voz nesta sessão:

| Arquivo | Data | Duração aprox. |
|---|---|---|
| `00000407-AUDIO-2026-08-27-14-35-29.opus` | 27/08, logo após a lista | ~2 min |
| `00000410-AUDIO-2026-08-29-11-00-30.opus` | 29/08 | **~4 min** |
| `00000422-AUDIO-2026-08-29-13-21-42.opus` | 29/08 | ~1,5 min |

O de 29/08 11:00 é o mais longo da conversa inteira, e a resposta do Guilherme foi
"**entendi perfeitamente**" — ou seja, tem instrução dentro. **Ouça os três antes de codar**,
porque podem revogar ou ampliar qualquer item deste documento.

---

## 9. Ordem sugerida

1. Ouvir os três áudios e completar esta lista
2. Corrigir **no Figma** — é o que ela pediu explicitamente
3. Mandar o Figma para ela e esperar o "ok"
4. Só então: G1–G8 (global, mexe em tudo), depois obra, home, A artista, Ensaios, Contato
5. Refazer a auditoria do E6 — a escala tipográfica nova, os vídeos de hover e as faixas de
   vídeo de cabeçalho/rodapé mexem em contraste, LCP e movimento. A home já estava fora do
   teto antes disso

---

## 10. Documentos a atualizar junto

| Documento | O que ficou desatualizado |
|---|---|
| `docs/02-direcao-visual.md` §3 | Fraunces/Instrument Serif → **Cormorant Garamond**; "display muito grande" → escala comprimida |
| `docs/02-direcao-visual.md` §4 | A sequência editorial com imagens de estudo alternadas foi rejeitada |
| `docs/01-plano-de-execucao.md` §1 | Rotas `sobre`/`textos` → `a-artista`/`ensaios`; anatomia da página de obra muda |
| `docs/07-estado-em-25-08-2026.md` | E1–E4 voltam a "em revisão" |
| `CLAUDE.md` | Rubrica em vetor sobe de "em aberto" para **bloqueio** |
