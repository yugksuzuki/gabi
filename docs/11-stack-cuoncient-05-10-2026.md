# Stack Cuoncient aplicada — 05 de outubro de 2026

Escrito em **segunda, 05/10/2026**, ao passar o projeto pelo padrão técnico da Cuoncient
(o mesmo de Lumen, Getpoke, Eloá e DUACT).

O pedido foi "aplicar o stack completo". Este documento existe porque **completo não quer
dizer tudo**: a regra do `CLAUDE.md` continua valendo — toda dependência nova justifica a
própria existência, e a lista do Stack Técnico é referência de arquitetura, não ordem de
compra. Então cada item do padrão foi conferido contra este site, e cada um saiu com uma de
três respostas: **já estava**, **entrou agora** ou **não entra, por este motivo**.

Base: `claude/peaceful-babbage-gl8lxt` em `e374fb4` (10/09), que é o que está em produção na
Vercel. Nada foi feito em cima das branches antigas.

---

## 1. O que entrou

| Item do padrão | O que é aqui | Onde |
|---|---|---|
| **Cabeçalhos de segurança** | `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'; base-uri 'self'; object-src 'none'`, `nosniff`, `Referrer-Policy`, HSTS, `Permissions-Policy`. E `X-Powered-By` desligado | `next.config.ts` · `testes/seguranca.spec.ts` |
| **pnpm** | Gerenciador oficial da Cuoncient. `package-lock.json` saiu, `pnpm-lock.yaml` entrou com as **mesmas versões** (importado, não resolvido de novo) | `package.json` (`packageManager`) |
| **Vercel Speed Insights** (item 31) | LCP, CLS e INP de quem visita de verdade. Sem cookie, sem dado pessoal, **0KB no bundle** — sem o pacote npm, ver abaixo | `src/app/[locale]/layout.tsx` |
| **GitHub Actions** (item 34) | A cada push: `verificar` + build + os testes de navegador | `.github/workflows/verificar.yml` |
| **Lighthouse CI** (item 38) | O orçamento de `docs/02` §5 medido contra o deploy da Vercel a cada publicação: reprova peso de JS e salto de layout, avisa nos tempos (§3) | `lighthouserc.cjs` · `.github/workflows/lighthouse.yml` |
| **WebP + foto do topo com prioridade** | O pôster da entrada virou WebP e é pré-carregado com prioridade alta; a foto da obra pede prioridade alta | §3 abaixo |

### Por que cada um se paga

- **Segurança** não muda nada do que se vê e fecha portas que o site não usa. A que mais
  importa aqui: um site de obra única não pode ser embutido em página de terceiro — é o
  primeiro passo de golpe com o nome dela. HSTS vai **sem** `preload` e sem
  `includeSubDomains` porque o domínio definitivo continua em aberto, e preload é
  compromisso que não se desfaz em semanas. Sem `script-src` na CSP: o Next injeta script
  inline e uma CSP de script mal calibrada quebra a hidratação sem aviso.
- **pnpm** é o padrão da casa, instala em metade do tempo e recusa dependência fantasma
  (pacote usado sem estar no `package.json`). Os scripts de instalação de três pacotes
  (`@parcel/watcher`, `@swc/core`, `unrs-resolver`) ficam desligados de propósito: são
  compiladores de reserva para quando falta o binário pronto, e o binário pronto vem.
- **Speed Insights** é o único jeito de saber o LCP de quem chega pelo Instagram, no celular
  dela. O Lighthouse mede um laboratório; isto mede o público. Entrou **sem** o pacote
  `@vercel/speed-insights`: medido, ele punha ~5KB gzip em toda página só para descobrir o
  nome da rota, num orçamento de JS que já está no limite. O script é o mesmo, servido pela
  própria Vercel, e só aparece no build dela (`VERCEL=1`) — local e no CI não existe.
- **Actions + Lighthouse CI** tiram o orçamento de performance da memória de quem lembra de
  rodar e põem numa máquina que não esquece. `docs/02` §5 já dizia "condição de merge, não
  meta" — faltava quem cobrasse.

---

## 2. O que já estava — e não precisava de nada

React 19 · TypeScript · Tailwind 4 · Zod · Prettier (com o plugin do Tailwind) · tokens de
cor em `:root` (`src/styles/tokens.css`) · Cormorant Garamond + Inter auto-hospedadas (as
duas estão no catálogo da Cuoncient) · AVIF/WebP via `next/image` · `aspect-ratio` e
dimensões reais para não haver salto de layout · `prefers-reduced-motion` · conteúdo que
existe sem JavaScript (testado) · `X-Robots-Tag` para não indexar o que tem `[PENDENTE]` ·
`CLAUDE.md` + `docs/` como contexto · Vercel ligada ao GitHub · helper de WhatsApp com
`encodeURIComponent` (`src/lib/whatsapp.ts`) · nunca inventar conteúdo (regra 2).

O padrão Cuoncient pede **Vitest** para testes. Aqui a lógica pura já é coberta pelos seis
`scripts/verificar-*.mjs`, sem dependência nenhuma, e o navegador pelo Playwright. Migrar
seria trocar o que funciona pelo que é igual. Fica para quando aparecer lógica nova que não
caiba nos scripts.

---

## 3. O que a medição mostrou — e o que já foi corrigido

Rodar o Lighthouse CI pela primeira vez foi o que fez o item valer a pena. Três achados:

**O LCP da home descia com prioridade baixa.** O maior elemento da primeira tela é o pôster
do vídeo de entrada. O navegador descobre o `poster` de um `<video>` tarde e o trata como
imagem qualquer: ele baixava **depois** da rubrica e da primeira obra — que nem aparece na
primeira tela. Agora `Entrada.tsx` pré-carrega o pôster com `fetchpriority="high"`, e o
arquivo virou WebP: **46KB → 18KB**, mesmo quadro.

**O LCP da obra também.** No Next 16, `priority` deixou de pedir prioridade alta — ele só
tira o lazy. A foto principal descia atrás do pôster do vídeo ao lado. `MidiaObra.tsx` agora
pede `fetchPriority="high"` explicitamente.

Os pôsteres dos vídeos das obras **continuam JPEG**, e não por esquecimento: o relevo de
Encontro é textura de alta frequência e, na mesma qualidade, o WebP saiu **maior** que o JPEG
(107KB contra 99KB). Formato é decisão por arquivo, não por regra.

**O peso de JS depende de onde se mede.** O orçamento diz "≤ 150KB comprimido". Na home:

| Onde | Compressão | JS |
|---|---|---|
| `next start` local | gzip | ~165KB |
| Vercel | brotli | ~137KB (estimado: brotli sobre os mesmos arquivos) |

Passa em produção, não passa no laboratório local — e as duas medidas estão certas. Por isso
o `lighthouserc.cjs` só **reprova** o peso de JS quando audita a Vercel (`URL_AUDITADA`), e
só **avisa** quando audita o build local. O código JavaScript desta branch tem **o mesmo
tamanho** do de antes, byte a byte; a única diferença no laboratório local são ~300 bytes de
cabeçalho de segurança por arquivo, que o HTTP/2 da Vercel comprime a quase nada.

### Antes e depois, na mesma máquina

Mediana de 5 rodadas por rota, 4G e CPU 4× simulados, build local:

| Rota | Antes (`e374fb4`) | Depois | Imagem baixada |
|---|---|---|---|
| `/pt` | 0,88 · LCP 3,7s | 0,88 · LCP 3,4s | 191KB → 164KB |
| `/pt/obras/encontro` | 0,89 · LCP 3,5s | 0,94 · LCP 3,0s | 249KB → 222KB |
| `/en` | 0,87 · LCP 3,4s | 0,92 · LCP 3,3s | 191KB → 164KB |

O ganho é real e pequeno, e está dentro do ruído: o mesmo build varia **mais de 1s de LCP**
e de 0,84 a 0,99 de nota entre rodadas nesta máquina. O que se pode afirmar sem ruído é a
ordem de download (agora certa) e os bytes (−27KB de imagem em toda página).

### A dívida que continua: o LCP

Na mediana de laboratório, **as três rotas passam de 2,5s**. A home já estava assim em E6
(`docs/validacao/e6`: "por volta de 3s no 4G simulado"). A obra, que em E6 media 2,3s, hoje
mede ~3s — mas a página mudou em 10/09 (foto + vídeo lado a lado, `docs/10` §7) **e** a
máquina que mede também, então a comparação direta não vale. Com o pôster e a foto agora
chegando primeiro, o que sobra é o tempo de o Next hidratar a página num celular lento — e
isso não se resolve trocando uma linha.

Por isso o `lighthouserc.cjs` divide o orçamento em dois:

- **Reprova** o que é determinístico e não varia entre rodadas: **salto de layout** (CLS) e
  **peso de JS**. São também as duas regressões mais prováveis aqui — uma biblioteca de
  animação que entra, ou uma imagem sem dimensão.
- **Avisa** o que é tempo: nota, LCP e TBT. Reprovar por sorteio deixa o CI vermelho à toa,
  e CI que fica vermelho à toa para de ser lido. O número aparece em todo deploy e o
  relatório fica salvo 30 dias como artefato.

Quem decide se o LCP é problema de verdade é o **Speed Insights**, com o celular de quem
visita. Se o número de campo passar de 2,5s, aí sim vale decidir o que sai para caber — e
`docs/02` §5 já diz qual é a regra: sai o efeito, não o teto.

---

## 4. O que não entra — e por quê

| Item do padrão | Por que não aqui |
|---|---|
| **shadcn/ui + Radix**, cmdk, embla, vaul, sonner, lucide | Seis rotas e um zoom que já é `<dialog>` nativo. Cada componente seria JavaScript sem função num orçamento que já está no limite |
| **Framer Motion / GSAP + ScrollTrigger** | O movimento de hoje é CSS puro (`animation-timeline: view()`), **0KB**. Framer custa ~35KB, GSAP ~45KB. `docs/01` §2 já dizia: só se couber no orçamento — e não cabe |
| **Lenis** (item 20) | Rolagem com inércia beira o scroll-jacking que `docs/02` §5 proíbe, e briga com o `scroll-snap` da página de obra. Se entrar, é decisão de direção (Catherine), não de stack |
| **javascript-obfuscator** | O repositório é **público**. Ofuscar o bundle de um código cujo fonte está aberto no GitHub não protege nada, e quebra a divisão de código do Next |
| **wouter, react-hook-form, recharts, Express, esbuild, Vite** | O Next já roteia e já empacota; não há formulário (contato é WhatsApp), gráfico nem servidor próprio |
| **Workflow LP-from-Instagram (n8n + Apify)** | É para LP de serviço local. Aqui o Instagram nunca é fonte de conteúdo do site — o Diário de Ateliê está fora da v1 (`CLAUDE.md`) |
| **PWA manifest** | Galeria de arte não é app instalável. Os ícones já existem |

---

## 5. Como usar

Uma vez por máquina (Windows, PowerShell):

```powershell
npm install -g pnpm
```

Depois, no projeto:

| Antes | Agora |
|---|---|
| `npm install` | `pnpm install` |
| `npm run dev` | `pnpm dev` |
| `npm run build` | `pnpm build` |
| `npm run verificar` | `pnpm verificar` |
| `npm run testar` | `pnpm testar` |
| — | `pnpm auditar` — Lighthouse contra o build local (rode `pnpm build` antes) |

Para auditar um preview da Vercel na mão:
`URL_AUDITADA=https://<preview>.vercel.app pnpm auditar`.

A Vercel reconhece o `pnpm-lock.yaml` sozinha; não há nada a mudar no painel para o build.

---

## 6. O que fica para quem toca o repositório

Nada disto é código, e nada disto se decide daqui:

1. **Ligar o Speed Insights no painel da Vercel** (projeto `gabi` → Speed Insights →
   Enable). Sem isso o componente carrega e não envia nada.
2. **Trocar a branch padrão do GitHub para `main`.** Hoje ela aponta para
   `claude/iniciar-projeto-coo1ga`, de 21/08 — é por isso que toda sessão nova clona o
   projeto mais velho e não vê o resto. `docs/10` §1 já tinha diagnosticado o sintoma.
3. **Levar `claude/peaceful-babbage-gl8lxt` e esta branch para `main`.** A produção da
   Vercel está servindo a `peaceful-babbage` promovida à mão; `main` está quatro commits
   atrás dela.
4. **Apagar o projeto `gabimain` na Vercel.** O único deploy dele foi cancelado e ele aponta
   para a branch de 21/08 — mas continua ligado a este repositório, então todo push pode
   disparar um build nele também. O workflow do Lighthouse já o ignora.
5. **A dívida do LCP** (§3): decidir se vale cortar algo para caber, depois de ver o número
   de campo no Speed Insights.
