# Encontro completa — registro de validação

`IMG_7017.JPG`, `IMG_7018.JPG` e `IMG_7019.JPG` chegaram em 26/08/2026, enviadas
pelo Guilherme (a rede do ambiente remoto bloqueia o Drive). Originais
3213×5712, da pasta `GAB/Encontro 11.230`.

## O que elas mostram — e por que importam

As duas de três quartos são as mais valiosas do conjunto. Elas mostram o que a
frontal não consegue mostrar: **que Encontro é relevo, não pintura**. Os vincos
saem bem à frente do plano da tela e a borda da peça aparece de perfil. Numa
obra descrita como "gesso e massa acrílica sobre tela", essa é a informação que
a fotografia frontal esconde.

`IMG_7017` é um enquadramento mais aberto, quase de frente — não é duplicata da
principal (`IMG_7015`), que preenche o quadro.

## Sequência da galeria

A ordem é uma volta em torno da obra, não a ordem dos arquivos:

1. **Principal** — frontal, preenchendo o quadro
2. **Ângulo** — aberto, quase de frente, com o rodapé
3. **Ângulo** — três quartos, piso à mostra, o relevo lendo em profundidade
4. **Ângulo** — três quartos pelo outro lado, mais perto da borda
5. **Detalhe** — textura e escorrido de prata
6. **Escala** — a obra num lugar

Os itens 2 a 5 vão numa grade de duas colunas. A **escala saiu da grade** e fecha
a página sozinha: ela não mostra a obra, mostra a obra num lugar — piso, rodapé,
altura de pessoa. E em grade de duas colunas com cinco itens ela ficava órfã na
última linha.

Ela **não sangra**, e isso é deliberado: a escala é um recorte da prancha de
ficha e tem só 822px de largura. Esticada para 1440 seria ampliada quase o dobro,
e a única imagem de contexto da página apareceria borrada. Fica no tamanho que a
fonte aguenta, com ar em volta.

## Resolução guardada

| Onde | Tamanho | Por quê |
|---|---|---|
| Drive | 3213×5712 | O original, intocado |
| `ativos/` | 2400px de largura | Folga para recorte futuro sem inchar um repositório público |
| `public/` | 1800px de largura | Teto do pipeline; `next/image` gera as variantes menores daqui |

## Um artefato de captura, não do site

As primeiras capturas saíram com o LQIP borrado no lugar das fotos da galeria.
Não era falha do site: `next/image` adia o que está abaixo da dobra, e a captura
de página inteira do Playwright não rola. O script agora rola a página antes de
fotografar.

## Medido

CLS **0,0000** nas duas larguras. `npm run verificar` passa.

## O que ainda falta em Encontro

- **Materiais e edição** — a ficha dela não traz. Não foi inventado
- **`tecnica.en` e `legenda.en`** — traduzir voz de artista sem aprovação é
  proibido por `docs/03 §4`. É por isso que a obra segue `estado: rascunho`
- **O vídeo** — três candidatos na pasta (`IMG_6561.MOV`, `C9668.MP4`,
  `IMG_6562.MP4`), nenhum escolhido
