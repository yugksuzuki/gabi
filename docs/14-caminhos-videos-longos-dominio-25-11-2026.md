# Caminhos, vídeos longos, imagens e domínio — 25 de novembro de 2026

Quatro pedidos do Guilherme, numa sessão só. Este documento registra o que mudou e o que
continua em aberto. Em conflito com docs anteriores, vale este.

## 1. Encontro passou a se chamar Caminhos

Pedido: *"obra 'encontro' (e tudo que diz respeito a ela) renomeie, vira 'caminhos'"*.

| O que | Antes | Agora |
|---|---|---|
| Título | Encontro | **Caminhos** |
| Slug e conteúdo | `content/obras/encontro.mdx` | `content/obras/caminhos.mdx` |
| Imagens e vídeos | `public/obras/encontro/` | `public/obras/caminhos/` |
| Rota PT / EN | `/pt/obras/encontro` · `/en/works/encontro` | `/pt/obras/caminhos` · `/en/works/caminhos` |
| Folha da obra | `ativos/ficha-encontro.jpg` | `ativos/ficha-caminhos.jpg` |
| Wireframe | `public/wireframe/img/encontro-frontal.jpg` | `…/caminhos-frontal.jpg` |

Também trocaram o `alt` das seis fotos, os testes, o Lighthouse, os scripts de imagem, de
rotas e de WhatsApp, o cartão de OG/story e o wireframe. **As URLs antigas redirecionam
(308)** em `next.config.ts`: o link de Encontro já circulou.

**O que NÃO mudou, de propósito:**

- **O texto dela.** A última frase continua *"É um encontro, entre o movimento e a
  permanência"*, e a legenda da obra (que sai dessa frase) também. É texto da artista: a regra 2
  vale para reescrever tanto quanto para inventar. Se ela quiser ajustar a frase ao nome novo,
  a frase vem dela.
- **Os nomes de origem.** A pasta do Drive e o álbum continuam "Encontro 11.230" e aparecem
  assim nos campos `origem` e `fonte`: é o endereço do arquivo, não o nome da obra.
- **Os `docs/` de antes de 25/11** dizem Encontro. São histórico: reescrever registro datado
  falsifica o registro. O `CLAUDE.md` avisa no topo de "Obras iniciais".

**Confirmar com ela:** a folha 3.jpg (a prancha da obra) diz "Encontro". Se a troca veio dela,
a prancha precisa ser refeita para bater com o site.

## 2. Os vídeos longos

Pedido: *"Use os vídeos versão longa"* — os brutos da pasta GAB do Drive, inteiros, no lugar
dos cortes de 12s (6s em ida e volta).

| Obra | Bruto | Duração | MP4 (H.264) | WebM (VP9) |
|---|---|---|---|---|
| Caminhos | `GAB/Encontro 11.230/IMG_6561.MOV`, 4K vertical | 1:38 | 12 MB | 8,3 MB |
| Instante | `GAB/IMG_7031.MOV`, 4K vertical | 1:34 | 9,6 MB | 7,9 MB |
| Desabrochar | `GAB/copy_CAE78986-….mov`, 1080×1920 | 1:02 | 7,5 MB | 5,2 MB |

Receita em `scripts/videos-longos.sh`: 720×1280 (antes 576×1024), 24 fps, **sem áudio**, teto
de ~1 Mbps no H.264 (com `faststart`) e 700 kbps no VP9, em duas passadas — em uma só o VP9 estourava o alvo e saía maior que o MP4. Pôster = primeiro quadro (`poster-longo.jpg`).

- **Onde toca:** na página da obra, no lugar do corte (campo `video.longo` no `.mdx`,
  `src/lib/obras.ts`). Continua `preload="none"`, mudo, em loop, e só começa quando o vídeo está
  à vista — nada desce na carga da página.
- **O corte curto ficou na home.** É o vídeo que passa por cima da foto no hover do cartão.
  Ali, 1:30 por cartão (~30 MB nos três) é exatamente o que a regra 4 proíbe.
- **Sem áudio:** o som dos brutos é o ambiente do celular, não trilha; e vídeo que toca sozinho
  precisa estar mudo. Se ela quiser som, é outra conversa — e a resposta dela sobre a Bugatti
  ("trava muito") pesa.
- **Primeira tentativa descartada:** CRF 23 sem teto deu 44 MB para Caminhos (o travelling em
  4K é caro). Com o teto, 12 MB.
- O bruto (90–530 MB) continua fora do git.

## 3. Imagens e responsividade — medido

Auditoria com Playwright em 360, 390 (@3x), 768 (@2x), 1024 (@2x), 1440 (@2x, MacBook) e 1920
px, nas seis rotas principais: para cada imagem, quantos pixels o arquivo escolhido pelo
navegador tem contra quantos a caixa pede (com `object-fit: cover` contado).

**Rolagem lateral: nenhuma**, em nenhuma largura.

**Corrigido** (todos no atributo `sizes`, que diz ao navegador qual arquivo baixar):

| Onde | Problema | Correção |
|---|---|---|
| Home, painéis A artista / Contato, celular | Painel alto (88svh) recorta a foto nas laterais; com `100vw` descia 1200px onde a tela mostra ~1700 — **borrava no iPhone** | `150vw` no celular, `100vw` no tablet em pé |
| Home, painéis, tablet em pé | Pedia metade do necessário (828 para 1574) | idem |
| Página da obra, tablet | Pedia 828px para uma caixa de 1008 | `66vw` até 1024px |
| Home, cartões, 768px | O corte de `sizes` (768) não batia com o do CSS (grade a partir de 768): o tablet baixava a foto de celular, 3× maior | cortes alinhados ao CSS |
| A artista / Contato, 768px | Mesmo desalinhamento | idem |

**Continua, e não se resolve no código:**

- **A rubrica** é um PNG de 490px. No rodapé ela aparece a 432px de largura: em tela Retina
  pede 864 e fica borrada. É o bloqueio que o `CLAUDE.md` já registra: **o vetor original vem
  da Catherine**. Vetorizar o raster daqui seria redesenhar a assinatura dela.
- **Desabrochar** tem só 941px de largura no original (`docs/06`). Na página cabe; no zoom,
  não há o que ampliar.

## 4. Domínio: gseleme.com.br

**Decidido pelo Guilherme em 25/11/2026: o domínio do site é `gseleme.com.br`**, registrado
no Registro.br. Isso fecha a questão que o `CLAUDE.md` deixava em aberto entre `gclm.com.br` e
o `gseleme.design` (que nunca foi domínio: é o @ do Instagram e o Gmail dela).

**Forma canônica: `https://gseleme.com.br`, sem www.** O `www` existe e redireciona para ela.

O site lê a URL de `NEXT_PUBLIC_SITE_URL` e, sem ela, de `VERCEL_PROJECT_PRODUCTION_URL`
(`src/lib/url-do-site.ts`). Com `gseleme.com.br` marcado como principal na Vercel, a segunda já
é ele — mas fixar a primeira em Production é o que garante canônica, hreflang e OG certos.

Caminho, mantendo o DNS do Registro.br:

1. **Vercel →** projeto `gabi` → Settings → Domains → Add `gseleme.com.br`. Aceitar a sugestão
   de adicionar `www.gseleme.com.br` **redirecionando para** `gseleme.com.br`.
2. **Registro.br →** `gseleme.com.br` → DNS → *Configurar endereçamento* → modo avançado /
   editar zona:
   - `A` com nome vazio → o IP que a Vercel mostrar
   - `CNAME` com nome `www` → o alvo que a Vercel mostrar
3. Esperar a Vercel validar (minutos a horas). O certificado sai sozinho.
4. **Vercel →** Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL=https://gseleme.com.br`,
   **só em Production** (em Preview, o preview tem de apontar para ele mesmo) → redeploy.

A alternativa (trocar os servidores DNS por `ns1/ns2.vercel-dns.com`) também funciona, mas
leva o DNS inteiro para a Vercel e derruba e-mail que algum dia for criado nesse domínio.

**O que o domínio não decide sozinho:**

- **A indexação segue fechada** (`ABRIR_INDEXACAO`) até as fichas saírem de `[PENDENTE]`.
  Domínio no ar não é site publicado — e a regra do Instagram no mesmo dia continua valendo.
- **`gclm.com.br`** continua dela, parado. Redirecionar para `gseleme.com.br` depende da
  pergunta "GCLM aparece na v1?".
- **HSTS** segue sem `preload` até o domínio estar estável no ar.

## Verificado

`pnpm verificar` passa. `pnpm testar` **54/54** contra o build de produção, axe-core sem violação AA. No build: as três páginas de obra servem `video-longo.*`, a home segue com o corte curto, e `/en/works/encontro` responde 308 para `/en/works/caminhos`.
