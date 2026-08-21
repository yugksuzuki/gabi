import type { ReactNode } from 'react'

/**
 * Raiz mínima. O <html> real vive em [locale]/layout.tsx, que é onde o `lang`
 * pode ser correto por rota (docs/01 §5).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
