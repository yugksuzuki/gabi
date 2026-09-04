# Alterações pedidas pela Gabriela — 27 a 29/08/2026

Fonte: `Gabriela Seleme — Wireframe 3.pdf` (o wireframe devolvido com marcações à mão, 27/08
14:22), a lista escrita dela às 14:23, os complementos de 14:26 e 14:34, e os **três áudios
de 27 e 29/08, agora transcritos** (§8).

Tudo aqui é pedido dela, na palavra dela.

---

## 0. A data de estreia existe: 8 de setembro

Áudio de 29/08, 11:00 — o mais longo da conversa:

> "Uma coisa superimportante que eu preciso alinhar com você é prazo. (…) eu não posso que
> fique nesse negócio 'ai te entrego amanhã', e vai indo e vai indo e não sai. Porque eu
> preciso que esse site esteja funcionando — deixa eu abrir o calendário aqui — **até dia
> oito. Dia oito tem que tá tudo perfeito.** Então basicamente a gente tem semana que vem só
> pra ver isso."

Isso encerra a pendência "data de estreia nunca travada" que atravessa todos os documentos.
E encerra com **terça-feira, 8 de setembro de 2026**.

Hoje é sexta, 4 de setembro. **Sobram quatro dias**, e o que está em aberto é uma reformulação
visual completa (§1 a §6) mais o conteúdo de duas das três obras, que não existe.

Duas consequências práticas:

- O cronograma "de trás pra frente" previsto em `docs/01` precisa ser feito hoje, não depois
  do Figma. E ele provavelmente vai mostrar que não cabe tudo.
- **A conversa que falta ter com ela é sobre escopo, não sobre prazo.** O que cabe até dia 8
  é o site com Encontro completo e as outras duas com o que existir. Melhor combinar isso
  agora do que entregar dia 8 com `[PENDENTE]` no ar.

Ela também pediu, no mesmo áudio, uma resposta objetiva que ainda não foi dada:
*"me fala quando que cê conseguiria apresentar essas alterações"*. Uma data, não um "logo".

---

## 1. Global — vale em todas as páginas

| # | Alteração | Origem |
|---|---|---|
| G1 | O wordmark tipográfico "Gabriela Seleme" sai. Entra **a logo** (a rubrica). Na p.2 ela escreveu "**sempre a logo**" — em todas as páginas | desenho p.1 e p.2 |
| G2 | Menu: **"Quem sou eu" → "A artista"**. Ela confirma em áudio: *"aquele documento do tipo quem sou eu, que eu troquei o nome pra ser a artista"* | desenho p.1 + áudio 27/08 |
| G3 | Menu: **"Textos" → "Ensaios"** | desenho p.1 |
| G4 | Tipografia: usar **Cormorant Garamond** | lista escrita |
| G5 | **"Não trabalhar com variação tão grande de tamanho de fontes"** — comprimir a escala: menos degraus e razão menor entre display e corpo | lista escrita |
| G6 | Textos conceituais **alinhados à esquerda**, nunca centralizados | lista escrita |
| G7 | **Aumentar o respiro** em volta de imagens e textos | lista escrita |
| G8 | Cabeçalho e rodapé **dinâmicos** (faixa de vídeo, no estilo da entrada da home) nas páginas internas | desenho p.7 + lista escrita |

**Consequência de G2/G3:** mudam as rotas. `/pt/sobre` → `/pt/a-artista`, `/pt/textos` →
`/pt/ensaios`, e os pares em EN. Como `robots` está fechado e nada foi indexado, trocar agora
custa zero. Depois de dia 8 seria redirect permanente. **Faça antes da estreia.**

**Consequência de G1:** a rubrica em vetor virou **bloqueio** — ela aparece em toda página.
Pedir o SVG à Catherine hoje.

**Consequência de G4/G5:** contradiz `docs/02-direcao-visual.md` §3 (Fraunces/Instrument Serif,
"display muito grande, é o gesto"). **A instrução dela vence.** Atualize o documento junto com
o código. Cormorant Garamond é SIL OFL — auto-hospeda com `next/font`, sem custo nem trava.

---

## 2. Home

| # | Alteração | Origem |
|---|---|---|
| H1 | **Apagar a lista índice** "01 Encontro / 02 Desabrochar / 03 Instante" | rabiscada, p.1 |
| H2 | **Apagar todas as imagens de estudo**: o díptico do ateliê, a foto do mar, a folhagem, a do processo. Ela riscou uma por uma | X em cada, p.1 |
| H3 | **Apagar os blocos de legenda** ("Uma linha sobre a obra…" + "VER A OBRA →") | X em cada, p.1 |
| H4 | Cada obra aparece com **uma foto só, limpa, apenas a obra** | lista escrita |
| H5 | **Hover na foto → começa a passar o vídeo da obra**, no lugar da foto | lista escrita |
| H6 | **Clique → página individual daquela obra** | lista escrita |
| H7 | A logo entra **em escrita dinâmica sobre o vídeo de cabeçalho**. Ela mandou o arquivo para a Catherine uma vez e acha que ainda tem | mensagem 14:34 |

**Decisão que sobra para você:** hover não existe em celular, e o celular é a maior parte do
tráfego que vem do Instagram. Opções — vídeo em silêncio ao entrar na viewport, ou toque para
tocar e segundo toque para abrir. Em qualquer caso, `prefers-reduced-motion` desliga.

**Peso:** três vídeos na home contra o teto de LCP 2,5s, que a home **já não passava** (~3s em
25/08). Vídeo só carrega no hover, `preload="none"`, pôster é a própria foto.

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
| O6 | **Ficha técnica: seguir o PDF que ela subiu na pasta de cada obra** | X sobre a tabela + áudio 27/08 |
| O7 | **Sem coluna de rótulos.** Ela foi literal: *"não precisa ter tipo assim, nome tananã. Acho que pode ser só organizado do jeito que tá naquele pdfzinho"* | áudio 27/08 |
| O8 | **Tirar o rótulo "VALOR"** | riscado, p.2 |
| O9 | Preço em **cinza, com fonte menor que as demais** | anotação, p.2 |
| O10 | **Consultar deixa de ser botão com caixa** — vira link discreto | X na caixa + lista escrita |
| O11 | A versão EN está riscada inteira: mesmas correções nos dois idiomas | X, p.4 |

**Onde está o modelo da ficha.** No áudio de 27/08 ela explica o que quis dizer com "seguir o
exemplo do material disponibilizado":

> "Você viu aqueles — acho que é PDF, eu acho que upei na pasta de cada obra, mas eu não tenho
> certeza. Um é tipo a ficha técnica da obra, e aquele documento do tipo quem sou eu."

**Primeira tarefa concreta: abrir as pastas de obra no Drive e achar esses PDFs.** Ela mesma
não tem certeza de que subiu. Se não estiverem lá, é um pedido de trinta segundos.

O que já se sabe do formato, pela prancha de Encontro:

```
Gabriela Seleme
Encontro, 2026
Gesso e massa acrílica sobre tela
115 x 180
```

Uma linha por informação, sem rótulo à esquerda, sem filete de tabela.

**Confirmar antes de publicar:** a prancha escreve `115x180`, o site mostra `180 × 115 cm`.
Alguém inverteu, e ninguém disse qual é a altura.

---

## 4. A artista (ex-Quem sou eu)

A página inteira está riscada com um X de ponta a ponta, com "utilizar diagramação já
disponibilizada".

O áudio de 27/08 diz exatamente qual diagramação e o que preservar dela:

> "É interessante manter aquela mesma diagramação, sabe? Tipo, **do jeitinho que tá: o
> 'Gabriela Seleme' entrando para dentro da foto, a logo em cima** — exatamente como tá tipo
> naquele PDF lá."

| # | Alteração |
|---|---|
| A1 | Reproduzir a diagramação da folha dela: **logo no topo, o nome entrando por dentro da foto** |
| A2 | O título "Quem sou eu" some. A página é **"A artista"** |
| A3 | Cabeçalho e rodapé com vídeo, no estilo da home |
| A4 | O conteúdo é o material já fornecido — **o texto dela não muda** |

O texto continua sendo `content/sobre.mdx`, transcrito literal. O que muda é o desenho.

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
| E3 | **Menu vertical slim à esquerda**, por data, no formato `MM.AA — Título` |
| E4 | Confirmar: *O Acúmulo e o Tempo* e *A Matéria como Memória* são títulos reais ou exemplos? Ela escreveu "ex:" |

Os textos ainda não chegaram — ela prometeu em 27/08 e repetiu em 29/08 ("eu vou te mandar os
textos também"). Ver §7 sobre o que ela autorizou usar enquanto isso.

---

## 6. Contato

| # | Alteração | Origem |
|---|---|---|
| C1 | **Cabeçalho dinâmico** (faixa de vídeo no topo) | escrito à mão, p.7 |
| C2 | **Rodapé dinâmico** (faixa de vídeo embaixo) | escrito à mão, p.7 |
| C3 | Mesmo formato da página "A artista" | lista escrita |

Nenhum conteúdo da página foi riscado — e-mail, Instagram e WhatsApp ficam como estão.

---

## 7. O que ela já entregou, e o que ela autorizou

**Já feito por ela** (áudio 29/08): *"na pasta das obras eu já coloquei só a foto principal e
o vídeo."* Era a promessa de 27/08, e ela cumpriu. **Vá no Drive antes de pedir qualquer
coisa** — a crítica dela de que "nem as fotos correspondem às obras" pode já estar resolvida.

**Ainda não chegou:**

1. Os textos dos ensaios — prometidos duas vezes
2. O arquivo da logo em escrita dinâmica ("mandei p cat uma vez mas acho q tenho aqui")
3. O último tópico da lista dela, *"exemplo da opção de exportação do portfólio"*, que nunca
   foi anexado

**O que ela autorizou explicitamente** (áudio 29/08):

> "Qualquer coisa usa coisas aleatórias de exemplo, se quiser botar um texto aleatório como
> exemplo — mas eu vou te mandar os textos também. Só pra você não se prender, não se prenda,
> vai resolvendo, porque o prazo é curto."

Isso libera lorem para **apresentar** o layout. Não revoga a regra 2 do `CLAUDE.md`: texto de
exemplo continua visivelmente exemplo, nunca ficção plausível sobre a obra dela, e **não sobe
para produção com `robots` aberto**. A distinção que importa é entre demonstrar e publicar.

---

## 8. Os três áudios, transcritos

Resolvido o buraco da versão anterior deste documento.

**`00000407` — 27/08, 14:35.** Explica "seguir o exemplo do material disponibilizado": os PDFs
que ela acha que subiu na pasta de cada obra, um com a ficha e outro com o "quem sou eu".
Confirma o nome "a artista", a diagramação a preservar (logo em cima, nome entrando na foto) e
a ficha sem rótulos. → §3 e §4.

**`00000410` — 29/08, 11:00.** É sobre prazo, e só sobre prazo. **Dia 8.** Confirma que as
pastas de obra já têm só a foto principal e o vídeo, autoriza texto de exemplo, e pede uma
data para a apresentação das alterações. → §0 e §7.

**`00000422` — 29/08, 13:21.** Sem requisito novo. Ela reforça: *"fazendo aquelas alterações e
sendo bem objetivo mesmo, eu acho que vai ficar bem dentro do que eu tô esperando."* E abre um
canal: *"se você tiver alguma dúvida me manda áudio, grava tua tela, manda vídeo."*

Nenhum dos três revoga qualquer item deste documento. O de 29/08 muda a ordem de tudo.

---

## 9. Ordem sugerida, com quatro dias

1. **Hoje:** responder a pergunta dela com uma data, e abrir a conversa de escopo para dia 8
2. **Hoje:** abrir as pastas do Drive — confirmar as fotos/vídeos novos e caçar os PDFs de ficha
3. **Hoje:** pedir à Catherine o SVG da rubrica e o arquivo da logo animada
4. **G1–G8** primeiro, porque mexem em tudo: logo, nomes, rotas, tipografia, escala, respiro
5. Depois **obra** (§3), que é a maior reformulação, depois **home**, **A artista**, **Ensaios**, **Contato**
6. Figma antes do código — pedido explícito dela, e o Guilherme já se comprometeu em áudio:
   *"primeiro eu vou ajeitar tudo no Figma"*
7. Refazer a auditoria do E6 antes de abrir a indexação. Escala nova, vídeos de hover e faixas
   de cabeçalho/rodapé mexem em contraste, LCP e movimento — e a home já estava fora do teto

---

## 10. Documentos a atualizar junto

| Documento | O que ficou desatualizado |
|---|---|
| `docs/02-direcao-visual.md` §3 | Fraunces/Instrument Serif → **Cormorant Garamond**; "display muito grande" → escala comprimida |
| `docs/02-direcao-visual.md` §4 | A sequência editorial com imagens de estudo alternadas foi rejeitada |
| `docs/01-plano-de-execucao.md` §1 | Rotas `sobre`/`textos` → `a-artista`/`ensaios`; anatomia da página de obra muda |
| `docs/04-pendencias-e-coleta.md` | Data de estreia **deixou de ser pendência**: 08/09/2026 |
| `docs/07-estado-em-25-08-2026.md` | E1–E4 voltam a "em revisão"; E7 tem data |
| `CLAUDE.md` | Rubrica em vetor sobe de "em aberto" para **bloqueio**; data de estreia travada |
