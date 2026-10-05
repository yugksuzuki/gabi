# Validação — stack Cuoncient (05/10/2026)

O que mudou na tela: **nada, de propósito.** Esta etapa mexeu em cabeçalho, gerenciador de
pacotes, CI e prioridade de download. A única troca de arquivo visível é o pôster da
entrada, de `poster.jpg` (46KB) para `poster.webp` (18KB), o mesmo quadro.

As capturas são com `prefers-reduced-motion: reduce`, que é quando o pôster aparece parado
no lugar do vídeo — o jeito de olhar o WebP sem o vídeo por cima.

| Captura | O que conferir |
|---|---|
| `portfolio-390/768/1440` | O pôster WebP sem artefato de compressão no céu e na água |
| `obra-encontro-390/768/1440` | A foto principal igual à de antes — só a prioridade de download mudou |

Verificado nesta etapa, a partir de instalação limpa com `pnpm install --frozen-lockfile`:

- `pnpm verificar` — tipos, lint, contraste, rotas, moeda, URL, WhatsApp: passa
- `pnpm testar` — **54/54** (os 44 de antes + 10 de cabeçalho de segurança), desktop e celular
- `pnpm auditar` — Lighthouse antes/depois na mesma máquina: ver `docs/11` §3
