# Dois registros na home — registro de validação

Porte da direção aprovada no wireframe
(`https://claude.ai/code/artifact/6bc53835-1ed4-4105-b10f-4e08290e53f5`) para o
código.

## O problema que isto resolve

A home tinha **um registro só**: obra em parede branca. Vídeo → obra → obra →
obra. Por isso lia como inacabada — não era falta de enfeite, era falta de
contraponto.

O que a Gabriela elogiou na Kelly Wearstler (áudio 03/09/24) não foi a vitrine.
Foi a entrada mostrando o **processo**: *"um vídeo com imagens dela montando uma
mesa, apresentando a coleção"*. Esse registro não existia no site.

## O que entrou

**Índice do acervo**, logo abaixo da entrada. Número, nome, ano — índice
editorial, sem imagem, sem preço, sem botão. Resolve duas coisas: o vazio entre
a entrada e a primeira obra, que lia como erro de layout; e a leitura, porque
quem chega vê de saída que o acervo tem três peças e quais são.

**Faixas de ateliê**, sangrando de borda a borda, entre as obras. A obra vive
dentro da margem; o ateliê sangra. É o contraste que dá ritmo de publicação em
vez de cadência de grade (`docs/02 §4`), e `docs/06 §3` garante que os dois
convivem: obra em cinza-neutro, ateliê em P&B.

**Numeração 01/02/03** em cada bloco de obra, e o filete do "Ver a obra" que só
aparece no hover — a referência não põe botão sobre a obra, põe uma linha que
responde.

**Título e ano na mesma linha de base** na página de obra. O ano é ficha de
museu: fica na borda oposta, pequeno, sem competir com o nome.

## A entrada agora tem dois tratamentos

`src/lib/entrada.ts` declara a proporção do arquivo, e ela sozinha escolhe o
layout — o componente não sabe de mais nada:

| Orientação | Tratamento |
|---|---|
| **Paisagem** | Sangra de borda a borda, nas duas telas. É o caso da referência |
| **Retrato** (hoje) | Sangra no celular, onde a proporção do arquivo é a da tela. No desktop vira painel na proporção nativa |

Quando `GABI SELEME V1.mp4` chegar e for horizontal, muda-se o arquivo e as duas
medidas em `src/lib/entrada.ts`. O hero passa a sangrar sozinho. Nenhuma outra
linha muda.

## Um bug de i18n, achado no caminho

Na página inglesa o placeholder mostrava **"Pending: legenda"** — o nome do campo
estava escrito literal em português no componente e vazava para o inglês.

`campo` virou chave em vez de texto (`pendente.campo.*` nas mensagens). Agora:

| PT | EN |
|---|---|
| Pendente: técnica | Pending: medium |
| Pendente: dimensões | Pending: dimensions |
| Pendente: texto da obra | Pending: work text |

## As faixas ainda não têm foto — e isso está certo

`src/lib/atelie.ts` está **vazio de propósito**. As 12 `DSC*.JPG` existem em
`GAB/Site gseleme` e não puderam ser baixadas nesta sessão: a política de rede
do ambiente remoto bloqueia `drive.google.com` (403 no CONNECT), e o conector do
Drive só devolve imagem em base64, grande demais para o contexto.

Lista vazia = faixa não renderiza = a página continua íntegra. Quando os
arquivos chegarem é acrescentar linha, como manda o CLAUDE.md: preenchimento,
não redesenho. O caminho está escrito em `content/atelie.yml`.

## Medido

| | Resultado | Teto (`docs/02 §5`) |
|---|---|---|
| CLS mobile | **0,0000** | ≤ 0,05 |
| CLS desktop | **0,0000** | ≤ 0,05 |

`npm run verificar` passa: typecheck, lint, contraste, rotas, moeda e URL.
