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
| `npm run verificar` | Tipos, lint, contraste AA, matcher de rotas e formatação de moeda |

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

## Estado

Etapa **E0 (Fundação)** concluída — ver [`docs/validacao/e0/`](docs/validacao/e0/) e
[`docs/01-plano-de-execucao.md`](docs/01-plano-de-execucao.md) para as etapas seguintes.

O site **não é indexável** (`robots` fechado + `noindex`) enquanto houver `[PENDENTE]` em
rota publicada. Abrir só na estreia, com `ABRIR_INDEXACAO=1`.
