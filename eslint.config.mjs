import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

/**
 * Flat config nativa do eslint-config-next 16 — sem FlatCompat.
 * `materiais/` fica fora do lint pelo mesmo motivo que fica fora do git.
 */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'materiais/**', 'next-env.d.ts'],
  },
  ...coreWebVitals,
  ...typescript,
]

export default config
