# Revisão de conteúdo e hierarquia — registro de validação

Revisão do que estava no ar depois de "Liga o conteúdo real". Três correções,
validadas a 390px, 768px e 1440px (arquivos nesta pasta).

## 1. As quebras de linha da transcrição não eram dela

O sintoma, em produção: a bio quebrava no meio da frase.

> Eu cresci imersa em arte, por pessoas que tinham arte como hobby — pintores, ceramistas,
> **↵** artesãos e uma mãe arquiteta que sempre passou mais tempo criando com as próprias mãos do que
> **↵** de qualquer outra forma.

O commit anterior tratou toda quebra simples como ritmo autoral. Conferido
contra os originais — `ativos/folha-bio-canva.png` e `ativos/ficha-encontro.jpg` —
a maior parte não é:

- Na folha da bio, o texto corre dentro de uma caixa estreita (o retrato ocupa
  a direita). Quando o retrato acaba, na metade da página, as linhas ficam
  largas e as quebras mudam de lugar. É **wrap da caixa do Canva**, não verso.
- Na prancha de Encontro, mesma coisa: a coluna tem ~1/3 da largura da página.

O que **é** dela, e continua preservado:

- `Esse caminho, / Essas peças, / São um reflexo de transformação, / De desenvolvimento.`
  — quatro linhas curtas, cada uma fechando em vírgula, com a linha anterior
  claramente não cheia.
- Em Encontro, o bloco central: cada frase começa em linha nova, junto, sem
  linha em branco entre elas. Isso a prancha mostra e o mdx agora reflete.

Corrigido **na fonte** (`content/sobre.mdx`, `content/obras/encontro.mdx`), não
no renderizador — o renderizador estava certo, a transcrição é que carregava o
wrap. `git diff` das duas: só junção de linhas, **nenhuma palavra alterada**.

## 2. Aviso de rascunho vazava para a página pública

`"Esta obra ainda está em rascunho: falta ficha técnica, fotografia ou texto."`
aparecia em caixa tracejada, largura cheia, logo abaixo do título da obra.

É linguagem de gestão de projeto numa página de galeria. E em Encontro era
enganoso: em português a obra está completa — ela é `rascunho` porque a
**tradução** ainda não foi aprovada, o que não diz nada a quem lê em PT.

Removido da página e das duas mensagens. A regra 2 do CLAUDE.md continua
cumprida pelo `<Pendente>`, que marca campo a campo o que falta — que é
justamente a marca que não pode ser confundida com conteúdo.

`estado: rascunho` segue no frontmatter e segue cobrado no build: nada mudou
na regra de publicação, só parou de ser exibido ao visitante.

## 3. As obras sem foto tinham o mesmo peso da que tem

Duas das três não têm uma única fotografia (`docs/06`). Na sequência todas
entravam com a mesma escala, e a home virava uma coluna de caixas cinzas
grandes — o "grade de vinte com dezessete buracos" que o CLAUDE.md manda evitar.

Agora a escala segue o material: obra fotografada ocupa a coluna larga; obra
por vir entra estreita, ao lado do nome. Ela continua na sequência, continua
clicável, só não finge ter imagem. Quando a foto chegar, cresce sozinha — é o
mesmo caminho de `ImagemObra`, sem redesenho.

No celular tudo empilha em largura cheia como antes (dividir 390px em duas
colunas cortava "Desabrochar" para fora da margem); a moldura vazia é que
empilha encolhida, para não engolir a tela.

## O que esta revisão NÃO resolveu

- **A home não tem abertura.** Kelly Wearstler e William Guillon abrem os dois
  com um plano cheio antes do catálogo. Aqui a página começa direto na primeira
  obra. Depende do vídeo de entrada — decisão de direção, não de código.
- **A página de obra sem material** deixa a coluna do texto vazia ao lado da
  ficha. Some quando houver texto; não vale inventar layout para o vazio.
- **Contato** tem só e-mail e Instagram. O WhatsApp continua fora até o número
  ser confirmado (`CLAUDE.md`, "Em aberto").
