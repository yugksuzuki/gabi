# Gabriela Seleme

Site da autora **Gabriela Seleme** — Balneário Camboriú (SC).

Antes de escrever qualquer linha de código, leia **[`CLAUDE.md`](CLAUDE.md)**. Ele traz o
posicionamento, as cinco regras invioláveis e as decisões já travadas com a cliente.

> **Repositório público.** `materiais/` (conversa, documentos comerciais, contatos de
> terceiros) está no `.gitignore` e não pode ser versionado — nem citado, nem resumido.

## Rodar

```bash
npm install
cp .env.example .env.local     # leia os comentários: há decisões em aberto ali
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção. **Falha** se uma obra `publicada` tiver ficha incompleta |
| `npm run verificar` | Tipos, lint, contraste AA, rotas, moeda, URL e o botão Consultar |
| `npm run testar` | axe-core (WCAG AA), teclado, sem-JS e troca de idioma, em desktop e celular |
| `npm run imagens` | Processa as fotos (Sharp + LQIP) |
| `npm run icone` | Regenera o ícone a partir da rubrica |

## Rotas

```
/                    redireciona por Accept-Language, padrão PT

/pt                  /en                  Portfólio (é a home)
/pt/obras/[slug]     /en/works/[slug]     Obra
/pt/sobre            /en/about            Quem sou eu
/pt/textos           /en/writing          Textos
/pt/contato          /en/contact          Contato
```

O slug da obra é o mesmo nos dois idiomas — nome de peça não se traduz. A troca de idioma
preserva a página: `/pt/obras/instante` → `/en/works/instante`, nunca a home.

## Onde mexer

| Quero | Vou em |
|---|---|
| mudar cor, tipografia, escala | `src/styles/tokens.css` — fonte única |
| corrigir ficha ou texto de obra | `content/obras/*.mdx` |
| corrigir a bio | `content/sobre.mdx` — **texto dela**, não reescreva |
| mudar rótulo de interface | `src/messages/{pt,en}.json` — só interface, nunca conteúdo autoral |
| adicionar rota | `src/i18n/routing.ts` **e** `scripts/verificar-rotas.mjs` |
| escrever um texto | `content/textos/` — copie `_modelo.mdx`, que explica cada campo |
| trocar o vídeo da home | `public/entrada/` (webm + mp4 + poster). Ver `src/lib/entrada.ts` — a proporção do arquivo escolhe o layout |
| trocar a tipografia | `src/styles/fontes/originais/` e depois `python3 scripts/gerar-fontes.py` |

## Estado

> **Comece por [`docs/10-estado-em-10-09-2026.md`](docs/10-estado-em-10-09-2026.md).** É o
> estado unificado: o que foi juntado de quatro branches, a data de estreia que passou, e a
> distância entre o wireframe que a Gabriela aprovou e o site que está construído.

**E0 a E4 e E6 concluídas** — na direção visual anterior. Faltam duas coisas, de naturezas
diferentes:

- **A revisão de 27/08 ainda não entrou no código.** Ela está aplicada às pranchas em
  `public/wireframe/`, não no site: o menu ainda diz "Quem sou eu" e "Textos", a tipografia
  ainda é Fraunces, e a rubrica não aparece no cabeçalho. Ver
  [`docs/08-alteracoes-gabriela-27-08-2026.md`](docs/08-alteracoes-gabriela-27-08-2026.md).
- **E5 — conteúdo real**, que depende da Gabriela: Desabrochar e Instante não têm foto, ficha
  nem texto, e Encontro tem a ficha pela metade. Ver
  [`docs/04-pendencias-e-coleta.md`](docs/04-pendencias-e-coleta.md).

Auditoria de qualidade em [`docs/validacao/e6/`](docs/validacao/e6/) — zero
violação AA, Lighthouse celular 87–100. Capturas de cada etapa em
`docs/validacao/`.

Antes da primeira execução de `npm run testar`, uma vez:
`npx playwright install chromium`. Em ambiente que já tem um Chromium fora do lugar padrão,
aponte `CHROMIUM_EXECUTAVEL` para ele em vez de baixar de novo.

O site **não é indexável** (`robots` fechado + `noindex`) enquanto houver `[PENDENTE]` em
rota publicada. Abrir só na estreia, com `ABRIR_INDEXACAO=1`.
