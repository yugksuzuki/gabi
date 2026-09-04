# Plano de execução

Ordem de trabalho, stack sequenciada e critérios de pronto.
Pressupõe `CLAUDE.md` lido e `02-direcao-visual.md` / `03-modelo-de-dados.md` à mão.

---

## 1. Arquitetura de informação

```
/pt                          Portfólio — home. Vídeo de entrada + as três obras
/pt/obras/[slug]             Obra: foto com zoom, vídeo por scroll lateral, ficha, texto,
                             preço, Consultar
/pt/a-artista                A artista
/pt/ensaios                  Ensaios — abre com um ensaio expandido, menu por data
/pt/ensaios/[slug]           Ensaio
/pt/contato                  Contato

/en, /en/works/[slug], /en/about, /en/writing, /en/writing/[slug], /en/contact
```

`/` redireciona por `Accept-Language`, padrão PT. Ver `03-modelo-de-dados.md` §4.

**As rotas mudaram em 27/08/2026, por pedido da cliente.** Ela renomeou duas abas no menu:
"Quem sou eu" virou **A artista**, "Textos" virou **Ensaios**. O nome visível e a rota
andam juntos, então `/pt/sobre` → `/pt/a-artista` e `/pt/textos` → `/pt/ensaios`. Os pares
em inglês (`/en/about`, `/en/writing`) não mudam — já estavam certos.

Trocar agora custa zero: `robots` está fechado e nada foi indexado. Depois da estreia, cada
troca dessas vira redirecionamento permanente que fica no projeto para sempre.

**A anatomia da página de obra também mudou** (mesma revisão): texto e ficha à esquerda,
uma foto só à direita com zoom, e a passagem foto → vídeo por scroll lateral no lugar da
galeria de ângulos. A ficha perdeu a coluna de rótulos e segue o modelo da prancha dela —
nome, obra e ano, técnica, dimensão, uma linha cada. Ver
`08-alteracoes-gabriela-27-08-2026.md`.

**A home é o portfólio.** Não existe home separada com "bem-vindo". A primeira coisa que a
pessoa vê é o vídeo e, na rolagem, a obra. Isso está no material: *"Portfólio — a porta de
entrada"*.

**Anatomia da página de obra**, na ordem de leitura:

1. Imagem principal, grande, quase sem cerimônia
2. Título e ano
3. Galeria (ângulo, detalhe, escala)
4. Vídeo, quando existir
5. Texto autoral
6. Ficha técnica, diagramada como registro de museu
7. Preço + **Consultar**
8. Navegação para a obra seguinte — mantém a pessoa dentro do acervo

O preço **não** é o elemento mais destacado. Ele informa; não vende.

---

## 2. Stack — sequenciada contra as 39 ferramentas

O `Gabriela_Seleme_Stack_Tecnico.pdf` foi entregue à cliente. É promessa, não rascunho. Por
isso a lista abaixo **sequencia**, não corta.

### Fase 1 — entra agora (o site existe sem isso? não)

| # | Ferramenta | Nota |
|---|---|---|
| 01 | Next.js App Router | SSG. Cada obra pré-construída |
| 02 | TypeScript | |
| 03 | React 19 | |
| 04 | next-intl | Rotas dedicadas PT/EN |
| 05 | Intl.NumberFormat | Nativo, zero dependência |
| 06 | hreflang | |
| 07 | PTAX (Banco Central) | Com fallback obrigatório |
| 08 | ISR | Revalidação diária da cotação |
| 10 | Zod | Valida obra antes de publicar |
| 11 | MDX | Textos |
| 12 | Tailwind | |
| 13 | Design tokens (CSS custom properties) | |
| 14 | next/font | Auto-hospedada, subsetting |
| 15 | next/image | AVIF/WebP |
| 16 | Sharp | Pipeline das fotos |
| 18 | LQIP / Blurhash | |
| 21 | JSON-LD VisualArtwork | |
| 22 | JSON-LD Person | |
| 23 | next-sitemap | |
| 24 | Open Graph / Twitter Cards | Por obra |
| 25 | URLs canônicas | |
| 27 | Deep link wa.me | Com fallback `mailto:` |
| 32 | Vercel | |
| 33 | GitHub | |
| 36 | ESLint + Prettier | |
| 39 | axe-core (WCAG 2.1 AA) | AA é promessa escrita |

### Fase 2 — na estreia ou logo antes

| # | Ferramenta | Condição |
|---|---|---|
| 19 | Framer Motion | Só se couber no orçamento de performance |
| 20 | Lenis | Idem |
| 26 | @react-pdf/renderer | Portfólio para galerias. Precisa do conteúdo real |
| 28 | Resend | Formulário de galerias/imprensa |
| 29 | Google Analytics 4 | Precisa de conta e consentimento |
| 30 | Search Console | Depende do domínio definitivo |
| 31 | Vercel Speed Insights | |
| 34 | GitHub Actions | |
| 35 | Cloudflare DNS | Depende do domínio definitivo |
| 38 | Lighthouse CI | |

### Fase 3 — quando houver motivo

| # | Ferramenta | Gatilho |
|---|---|---|
| 09 | Sanity | Quando a Gabriela for cadastrar obra sozinha. Ver `03-modelo-de-dados.md` §8 |
| 17 | Mux | Quando houver vídeo longo de obra. Vídeo de fundo de home não justifica custo recorrente |
| 37 | Playwright | Quando houver fluxo estável para regredir. Prioridade: troca de idioma preservando página |

**Regra:** nada fora dessa lista entra sem uma linha de justificativa no PR.

---

## 3. Estrutura de pastas

```
gabriela-seleme/
├── CLAUDE.md
├── docs/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # portfólio
│   │   │   ├── (obras)/[slug]/page.tsx
│   │   │   ├── sobre/page.tsx
│   │   │   ├── textos/[[...slug]]/page.tsx
│   │   │   └── contato/page.tsx
│   │   ├── api/cotacao/route.ts            # PTAX + cache
│   │   ├── og/[...params]/route.tsx        # Open Graph dinâmico
│   │   ├── story/[slug]/route.tsx          # card 1080×1920 (o pedido dela)
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── obra/                           # Sequencia, FichaTecnica, Galeria, Consultar
│   │   ├── layout/                         # Nav, Rodape, TrocaIdioma
│   │   └── ui/
│   ├── content/
│   │   ├── obras/{desabrochar,instante,encontro}.mdx
│   │   └── textos/
│   ├── lib/
│   │   ├── obras.ts                        # leitura + validação Zod
│   │   ├── moeda.ts                        # PTAX, formatação, fallback
│   │   ├── whatsapp.ts                     # deep link + fallback mailto
│   │   └── schema.ts                        # JSON-LD
│   ├── messages/{pt,en}.json               # interface, NÃO conteúdo autoral
│   └── styles/tokens.css
├── public/
│   ├── obras/<slug>/
│   └── video/
├── scripts/
│   ├── processar-imagens.ts                # Sharp + LQIP
│   └── gerar-pdf.ts                        # portfólio para galerias
└── materiais/                              # INTERNO — ver .gitignore
```

**Antes do primeiro commit:** se o repositório for público, `materiais/` vai para o
`.gitignore`. Contém conversa privada, dados comerciais e contatos de terceiros.

---

## 4. Etapas

Cada etapa termina com **screenshot em 390 / 768 / 1440** e um critério objetivo.

**E0 — Fundação** · repo, Next + TS + Tailwind, tokens, fontes, i18n com as rotas dos dois
idiomas, deploy na Vercel em domínio provisório.
*Pronto quando:* as duas rotas de idioma respondem, a troca preserva a página, e a Vercel
publica a cada push.

**E1 — Sistema visual** · tokens de cor e tipografia aplicados, escala fluida, grid, nav e
rodapé, página de exemplo com hierarquia real.
*Pronto quando:* o checklist de "parece galeria, não template" (`02-direcao-visual.md` §8) passa.

**E2 — Portfólio** · sequência editorial das três obras com placeholders explícitos, vídeo de
entrada com pôster e fallback.
*Pronto quando:* com três obras, a página parece completa. E parece bem no mobile.

**E3 — Obra** · página completa, ficha técnica, galeria, texto, preço com conversão, Consultar
com fallback, JSON-LD, OG por obra.
*Pronto quando:* Consultar abre o WhatsApp com o nome certo nos dois idiomas — ou o `mailto:`
equivalente enquanto não houver número.

**E4 — Sobre, Textos, Contato** · área editorial com MDX, rota do card de story, formulário
de contato.
*Pronto quando:* um texto publica nos dois idiomas e gera card de story legível.

**E5 — Conteúdo real** · fotos processadas, fichas técnicas, textos, bio, preços.
*Pronto quando:* nenhum `[PENDENTE]` em rota publicada.
**Esta é a etapa que depende da cliente e é a que historicamente trava o projeto.**

**E6 — Qualidade** · Lighthouse ≥ 90 mobile, axe-core limpo, teste de troca de idioma,
metadados, sitemap, verificação sem JS.
*Pronto quando:* o orçamento de performance passa e o axe não acusa violação AA.

**E7 — Estreia** · domínio definitivo, DNS, Search Console, analytics, PDF de galeria,
treinamento.
*Pronto quando:* site e Instagram sobem no mesmo dia — a promessa central do projeto.

---

## 5. Acessibilidade — WCAG 2.1 AA

Prometido por escrito (item 39), então é requisito e não bônus.

- Contraste 4.5:1 em texto, 3:1 em interface — **verificar o acento antes de travar a paleta**
- `alt` descritivo por imagem, **nos dois idiomas**, descrevendo a obra e não o arquivo
- Foco visível em tudo que é focável. Não remova outline sem substituir por algo melhor
- Ordem de tabulação natural, sem armadilha de foco
- `prefers-reduced-motion: reduce` desliga todo movimento
- Vídeo: nunca `autoplay` com som; pôster obrigatório; legendas se houver fala
- `<html lang>` correto por rota; trecho em outro idioma marcado com `lang`
- Hierarquia de cabeçalhos sem pular nível
- **Teste real:** navegar o site inteiro só com teclado, uma vez, antes de mostrar à cliente

---

## 6. SEO

- Rotas por idioma + hreflang recíproco + `x-default` → PT
- Canônica por página
- `VisualArtwork` e `Person` (§7 do modelo de dados)
- Sitemap com as duas versões de cada página
- OG por obra — o link vai circular no Instagram e no WhatsApp; o card é o primeiro contato
- Title e description escritos, nunca gerados por template genérico
- Imagem grande, rápida e com `alt` bom: é assim que uma obra aparece no Google Imagens, que
  é caminho real de descoberta para arte
- Search Console nas duas propriedades depois do domínio definido

---

## 7. Publicação na Vercel

1. Repositório no GitHub. `main` protegida; trabalho em branch
2. Projeto na Vercel conectado ao repo. Preview por PR — é o link que você manda para ela ver
3. Variáveis: `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_SITE_URL`, chaves de e-mail e analytics.
   **Nada de segredo no repositório**
4. Domínio definitivo (**pendente**) → DNS na Cloudflare → HTTPS automático
5. `NEXT_PUBLIC_SITE_URL` correta em produção — canônica e OG dependem dela
6. Speed Insights ligado
7. Antes de indexar: `robots.txt` liberando só quando o conteúdo real estiver no ar. Site
   indexado com `[PENDENTE]` é dano difícil de reverter

---

## 8. Validação visual

Um site desta categoria não se verifica lendo diff.

- Screenshot em **390 / 768 / 1440** a cada etapa visual, no repositório, versionado
- Comparação lado a lado com a referência — de **atmosfera**, não de pixel
- Teste em tela real de celular antes de qualquer apresentação: a maior parte do tráfego vem
  do Instagram
- Um preview da Vercel por conversa com a cliente, com a lista do que mudou

---

## 9. Checklist de aprovação da cliente

Para a Gabriela ver e responder — não para o desenvolvedor marcar sozinho.

**Direção visual**
- [ ] A atmosfera está próxima do que ela sentiu na Kelly Wearstler
- [ ] A cor assinatura foi escolhida por ela, a partir das obras
- [ ] A tipografia representa o trabalho dela
- [ ] O site parece galeria, não loja

**Obra**
- [ ] Ficha técnica correta nas três: título, ano, técnica, dimensões, materiais
- [ ] Textos das obras aprovados por ela, palavra por palavra
- [ ] Fotos aprovadas, na ordem que ela escolheu
- [ ] Preços conferidos; conversão em dólar aceitável como referência
- [ ] O botão Consultar chega no WhatsApp certo, com a mensagem certa

**Conteúdo**
- [ ] "Quem sou eu" soa como ela — e não a rotula de um jeito que ela não escolheu
- [ ] Pelo menos um texto publicado nos dois idiomas
- [ ] Inglês revisado por alguém que fala inglês

**Antes do ar**
- [ ] Domínio definido e no ar
- [ ] Contatos corretos: WhatsApp, e-mail, Instagram
- [ ] Testado no celular dela
- [ ] Data de estreia travada, com o Instagram pronto para o mesmo dia
- [ ] Ela sabe pedir alteração e sabe o que consegue mudar sozinha

---

## 10. Riscos que o plano não elimina

**Conteúdo é o caminho crítico, não o código.** Fotos, fichas, textos, bio e preços não
existem. E5 depende inteiramente da cliente. Por isso E0–E4 são construídos com placeholder
explícito: quando o material chegar, é preenchimento, não construção.

**A fotografia decide o resultado.** Mande a spec (`02-direcao-visual.md` §7) antes da sessão.
Depois de fotografado, não tem código que conserte.

**O comercial não está fechado.** Não construa widgets, automação ou tráfego antes de saber
qual caminho ela escolheu.

**Não indexe placeholder.** `robots.txt` fechado até o conteúdo real subir.
