# Entrada em vídeo — registro de validação

`docs/01 §1` e `docs/02 §1` pedem isso desde o começo: **"A home abre em vídeo."**
O que a Gabriela elogiou na Kelly Wearstler (áudio 03/09/24) não foi o site
inteiro — foi a entrada, *"um vídeo com imagens dela montando uma mesa,
apresentando a coleção"*.

## O material recebido

Arquivo enviado pelo Guilherme em 25/08/2026:
`46c07971-copy_0C668C923D99459BB627B745B12A5AA9_1.mov`

| | |
|---|---|
| Formato | HEVC, 1080×1920 (9:16), 30fps, 18,73s |
| Áudio | tem 1 faixa (não usada — a entrada é muda) |
| Conteúdo | ateliê, moodboard, praia e skyline de Balneário Camboriú, janela |
| Legenda | **queimada na imagem**, texto branco centralizado |

O texto que corre queimado no vídeo, transcrito dos frames:

> processo de criação da GSeleme · não aqui mesa · lá fora ·
> essa verdade · arte a vida e tá todo lugar

**Isso é peça de Instagram, não vídeo de fundo.** Legenda queimada num hero é
irreversível: não dá para traduzir no `/en` e não dá para desligar. O corte
existe porque o material bruto por baixo da legenda é bom.

## Como o corte foi escolhido

Legenda detectada quadro a quadro (pixels quase-brancos na faixa central).
Três janelas limpas no vídeo inteiro:

| Janela | Duração | Conteúdo | Decisão |
|---|---|---|---|
| 0,00 – 2,70s | 2,7s | ela segurando a peça de galhos | **descartada** — o kimono estampado rosa e amarelo briga de frente com a paleta neutra dos tokens |
| 7,75 – 10,70s | 3,0s | praia, flores, mar, rocha | descartada — bonito, mas genérico e sem nada dela |
| **15,00 – 17,70s** | **2,7s** | janela, skyline ao anoitecer, uma peça dela em silhueta | **escolhida** |

O fade-to-black do original começa em 17,70s (brilho médio despenca de 148 para
3), por isso o corte fecha ali.

A janela escolhida é um plano único, sem corte interno, com travelling lento —
e a paleta (azul-acinzentado, cinza, preto) cai dentro dos tokens em vez de
brigar com eles.

## Loop sem emenda

2,7s é curto demais para um loop: repete rápido e fica inquieto, o oposto do
que a entrada quer. Resolvido em **ping-pong** — a ida seguida da volta, sem
repetir os quadros extremos. Ciclo de 5,4s, e como o movimento é um travelling
lento, a volta não se lê como "reverso", se lê como a câmera voltando. Não há
ponto de emenda porque não existe corte: o fim da ida é o começo da volta.

## Dois formatos, de propósito

| Arquivo | Codec | Peso |
|---|---|---|
| `entrada.webm` | VP9, crf 40 | 475KB |
| `entrada.mp4` | H.264, crf 30, `+faststart` | 462KB |
| `poster.jpg` | primeiro quadro do loop | 46KB |

O WebM vem primeiro no `<video>` e não é redundância. **H.264 não é livre:**
Chromium compilado sem codecs proprietários — o padrão em boa parte do Linux —
e Firefox em sistemas sem o decodificador do SO não abrem o mp4. E o `<video>`
não avisa: fica no pôster para sempre. Isso não é teoria, foi o que aconteceu
aqui: na primeira validação o vídeo não tocou (`videoWidth: 0`, `duration:
null`) justamente por servir só mp4. VP9 cobre esses; o mp4 cobre Safari e iOS,
que não tocam VP9.

O pôster é o **primeiro quadro do loop**, não um quadro bonito do meio — senão
há um salto visível no instante em que o vídeo começa.

## Por que o desktop não sangra

O material é 9:16. No celular isso sangra de borda a borda e é exatamente a
proporção da tela. No desktop, não: esticar 9:16 numa faixa de 1440 obriga o
`cover` a ampliar 2× e a descartar 70% do quadro. A primeira tentativa está
descrita aqui porque o resultado foi didático — galhos gigantes e borrados,
sem enquadramento. Movimento que custa qualidade não entra (`docs/02 §5`).

Então o desktop trata o vídeo como **painel na proporção nativa, com ar em
volta** — o modelo do William Guillon que `docs/02 §1` aponta para objeto
isolado. Em ~415px de largura, o quadro de 720 está sendo *reduzido*: nitidez
de sobra. Centralizado, com vazio igual dos dois lados: nessa largura, o vazio
todo de um lado só lê como erro de layout.

## Medido

| | Resultado | Teto (`docs/02 §5`) |
|---|---|---|
| CLS mobile | **0,0000** | ≤ 0,05 |
| CLS desktop | **0,0000** | ≤ 0,05 |
| Vídeo | 476KB | — |
| Home completa | 1,4MB | — |

Reprodução confirmada nas três larguras (`currentTime > 0`, `paused: false`,
`duration: 5.4`). `prefers-reduced-motion: reduce` verificado: o vídeo sai com
`display: none` e a estática entra — mesmo quadro, parado.

Sem JavaScript: `autoplay muted loop playsinline` é HTML puro. `docs/02 §5`
proíbe efeito que dependa de JS para o conteúdo aparecer.

## Pendências desta entrada

- **A peça que aparece no vídeo não é nenhuma das três obras.** Não é
  *Desabrochar*, nem *Instante*, nem *Encontro* — é outra peça dela, em
  silhueta. Abrir o portfólio com uma peça que não está no portfólio é decisão
  dela, não nossa. **Perguntar antes de publicar.**
- **Este NÃO é, provavelmente, o vídeo de entrada.** Identificado em 26/08/2026:
  o arquivo é `copy_0C668C92-3D99-459B-B627-B745B12A5AA9.mov`, da pasta
  `Gabi Seleme :) / 2- Editados` da Catherine (29.054.242 bytes — bate byte a
  byte). É material de Instagram.
  O candidato era **`GABI SELEME V1.mp4`** (519 MB, em `GAB/Site gseleme`).

> **RESOLVIDO em 26/08/2026: o V1 é VERTICAL.** Guilherme conferiu. Isso fecha
> a questão do hero — o tratamento de retrato que está no ar é o certo, e não
> há o que trocar. O desktop segue com o painel na proporção nativa, porque
> `src/lib/entrada.ts` escolhe pelo formato do arquivo e nenhum material
> horizontal existe. Sangrar de borda a borda no desktop deixa de ser um
> "quando chegar o vídeo certo" e passa a depender de uma filmagem nova.

  Continua valendo trocar o corte por um do V1 se ele for melhor que este — mas
  é troca de conteúdo, não de layout.
- **Origem do arquivo bruto.** Não está em `ativos/` nem versionado — só o
  corte entrou em `public/entrada/`. O `.mov` original segue fora do git.
