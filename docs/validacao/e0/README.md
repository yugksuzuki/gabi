# E0 — Fundação · registro de validação

Critério de pronto (docs/01 §4): *"as duas rotas de idioma respondem, a troca preserva a
página, e a Vercel publica a cada push."*

## O que passou

| Verificação | Resultado |
|---|---|
| 13 rotas nos dois idiomas | 200, `<html lang>` correto em cada uma |
| `/` por `Accept-Language` | 307 → `/pt` (padrão) |
| Caminho interno no idioma errado | 307 → rota localizada (`/en/sobre` → `/en/about`), sem conteúdo duplicado |
| **Troca de idioma preserva a página** | 12/12 nos dois sentidos, incluindo rota com parâmetro |
| `hreflang` recíproco + `x-default` → PT | Presente em todas as páginas, conjuntos idênticos entre idiomas |
| `<link rel="canonical">` por idioma | Presente |
| Contraste WCAG 2.1 AA | 6 pares, todos acima do mínimo |
| axe-core (wcag2a/2aa/21a/21aa) | 0 violações — 9 rotas × 390px e 1440px |
| Sem JS | Obra, ficha técnica, texto e Consultar presentes no HTML |
| Botão Consultar sem WhatsApp | Cai no `mailto:` com assunto e corpo equivalentes |
| `precoBRL: null` | "Sob consulta" / "Price on request" |
| Palavras proibidas (comprar/carrinho/checkout) | Nenhuma ocorrência |
| Build com obra `publicada` incompleta | **Falha**, exit 1, listando o que falta |
| `robots` + `noindex` | Fechado, como manda docs/01 §7.7 |

## Screenshots

390 / 768 / 1440, `prefers-reduced-motion: reduce`, `deviceScaleFactor: 2`.

`portfolio` · `obra-encontro` · `obra-instante` · `sobre` · `contato` · `obra-en`

## O que ficou fora, e por quê

- **Vídeo de entrada da home** — E2. O arquivo existe (ela separou), mas não chegou aqui.
- **Cotação PTAX ao vivo** — a API do Banco Central não é acessível deste ambiente
  (HTTP 000). O *fallback* está correto e testado: sem cotação, mostra só o BRL e a página
  não quebra. **Confere no primeiro deploy**, onde há rede: em EN, `R$ 11.230` deve virar
  `R$ 11.230 (approx. US$ …)`.
- **Fotografia** — nenhuma imagem entrou em `public/`. `MolduraObra` ocupa a proporção
  final para que a chegada das fotos seja substituição, não redesenho.
- **Deploy na Vercel** — última linha do critério de pronto, ainda pendente.

## Regressões baratas

```bash
npm run verificar     # tipos, lint, contraste AA, matcher de rotas, moeda
```

O matcher de rotas tem teste próprio porque foi onde apareceu o bug que docs/03 §4 manda
vigiar: em `/en/works/instante` o seletor de idioma apontava para `/en/obras/instante` —
o caminho interno, não o traduzido. Rota estática funcionava por coincidência (em PT o
caminho visível é igual ao interno); rota com parâmetro, não.
