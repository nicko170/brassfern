import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The harness deploys to GitHub Pages at a sub-path. BASE_PATH (e.g. /brassfern/)
// drives Vite's `base`; SITE_URL is forwarded to the client bundle as VITE_SITE_URL
// so canonical URLs / OG tags / sitemap can be absolute.
if (!process.env.VITE_SITE_URL && process.env.SITE_URL) {
  process.env.VITE_SITE_URL = process.env.SITE_URL
}

const base = process.env.BASE_PATH || '/'

// Replace %BASE_URL% placeholders in index.html (Vite doesn't do this natively).
function htmlBase() {
  return {
    name: 'brassfern-html-base',
    transformIndexHtml(html: string) {
      return html.replace(/%BASE_URL%/g, base)
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), htmlBase()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
})
