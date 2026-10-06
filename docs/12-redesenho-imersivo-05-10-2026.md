# Redesenho imersivo — 05 de outubro de 2026

Escrito em **segunda, 05/10/2026**. Publicado direto na `main`, por decisão do Guilherme ("não
precisa ser na versão teste, joga ao vivo").

## Por que

O site fazia o que ela pediu, mas não passava a sensação da referência. Comparado lado a lado
com o site da Kelly Wearstler, no celular e no computador:

- **A primeira tela não era imagem.** No celular, a referência abre com um vídeo de mãos
  montando uma peça, de borda a borda, com o menu por cima. O nosso abria com uma faixa bege de
  menu, um vídeo numa caixa de 64% da tela e bege vazio. E é justamente a entrada que ela
  elogiou: *"um vídeo com imagens dela montando uma mesa"* (`docs/02` §1).
- **As peças não ocupavam a tela.** Colunas estreitas com muita margem em volta: lia como
  portfólio, não como galeria.
- **Três páginas que ela redesenhou em 27/08 continuavam como antes** (`docs/10` §3, "§4 a §6:
  Não"). "A artista" era exatamente o desenho que ela riscou inteiro. "Ensaios" estava no menu
  dizendo "Nenhum texto publicado ainda."
- A mesma nota — "Em exposição na Galeria Caos" — repetida embaixo das três obras.

## O que mudou

| Onde | Antes | Agora | Origem |
|---|---|---|---|
| **Entrada, no celular** | Vídeo em 64% da tela, menu acima em faixa bege | Vídeo na tela **inteira**; menu e rubrica claros por cima, com degradê no topo para leitura | Referência + `docs/02` §1 |
| **Entrada, no computador** | Painel 9:16 centralizado | **Igual.** O material é vertical; sangrar 9:16 numa tela larga joga 70% do quadro fora | `docs/10` §3, G8 |
| **Obras na home** | Colunas de ~35%, escalonadas, nome pequeno embaixo | **Uma obra por tela.** Celular: foto de borda a borda. Computador: foto à altura da tela, nome grande ao lado, na base, alternando de lado | Referência + `docs/02` §8 ("obra ocupa mais de 70% da área visível") |
| **Nota da galeria** | Repetida nas três | **Uma vez**, antes da sequência — quando as três notas são iguais. Se forem diferentes, cada peça volta a mostrar a sua | Pedido de 08/09 |
| **A artista** | Rubrica, título "A artista", texto, dois retratos | **A folha dela:** rubrica grande no alto, "Gabriela" no papel e "Seleme" já sobre o retrato, retrato sangrando até a borda, texto ao lado. Sem o título "A artista" na página | `docs/08` §4, A1, A2, A4 |
| **Contato** | Título e tabela | **O mesmo formato de A artista:** rubrica, título, contatos, e o rosto sangrando à direita | `docs/08` §6, C3 |
| **Ensaios** | No menu, levando a uma página vazia | **Fora do menu** enquanto não houver ensaio publicado. Volta sozinho no build em que o primeiro entrar. A rota continua existindo | — |

### Duas decisões de legibilidade, medidas

- **"Seleme" em tom claro sobre o retrato.** Na folha impressa o nome é preto sobre a madeira.
  Em tela, preto sobre aquela faixa da foto dá **2,1:1** — medido no arquivo, na região em que
  o nome passa —, abaixo do mínimo de 3:1 para texto grande. Claro sobre a mesma madeira dá
  **5:1 ou mais**. O nome entra na foto, como ela pediu, e continua legível.
- **Em Contato o título não entra na foto.** O lado esquerdo do rosto é preto; nenhuma cor de
  texto escuro sobrevive ali. O formato é o mesmo de A artista, sem o sobreposto.

### O segundo retrato

O rosto (`public/sobre/rosto.jpg`) saiu de A artista — a folha dela tem uma foto só — e foi
para Contato. Nenhuma foto nova entrou no site.

## O que continua bloqueado por material, não por código

| Falta | Destrava | Com quem |
|---|---|---|
| **Vídeo horizontal dela fazendo as peças** — provavelmente `GABI SELEME V1.mp4` (545MB, `GAB/Site gseleme`) | A entrada em tela cheia no **computador** e as faixas de vídeo no cabeçalho e no rodapé (G8, A3, C1, C2) | Gabriela. O conector do Drive não baixa acima de 10MB: precisa vir direto, ou um corte de 10–20s |
| **Rubrica em vetor** | A rubrica nítida em qualquer tamanho — ela agora aparece grande em A artista e Contato | Catherine |
| **Foto de Desabrochar em resolução** | A peça em tela cheia sem perder nitidez — a foto atual tem 941px de largura | Gabriela |
| **Textos dos ensaios** | A aba Ensaios volta ao menu | Gabriela (prometidos em 27 e 29/08) |

## Processo

Ela pediu, em 27/08, para ver o desenho antes de ir para o código (`docs/08` §9, item 6). Esta
etapa foi direto para a produção por decisão do Guilherme. Vale mandar o link para ela com o que
mudou e por quê — este documento serve de roteiro.

## Verificado

`pnpm verificar` passa. `pnpm testar` **54/54**, desktop e celular — o axe-core continua sem
violação AA em todas as rotas, inclusive com o menu sobre o vídeo e o nome sobre o retrato.
Sem rolagem horizontal em 390, 768 e 1440. Lighthouse local: salto de layout (CLS) continua 0,
peso de JS igual ao de antes (nenhuma dependência nova).

Capturas em `docs/validacao/redesenho-05-10/`.
