import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import weddingConfig from './src/config/weddingConfig.js';

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * Injects title / description / link-preview tags from weddingConfig.js into
 * index.html at build time, so WhatsApp & social previews show the couple's names.
 */
function weddingMetaPlugin() {
  return {
    name: 'wedding-meta',
    transformIndexHtml(html) {
      const { meta } = weddingConfig;
      const site = (meta.siteUrl || '').replace(/\/$/, '');
      const ogImage = `${site}/images/og-image.jpg`;
      return html
        .replaceAll('%WEDDING_TITLE%', escapeHtml(meta.title))
        .replaceAll('%WEDDING_DESCRIPTION%', escapeHtml(meta.description))
        .replaceAll('%WEDDING_URL%', escapeHtml(site || '/'))
        .replaceAll('%WEDDING_OG_IMAGE%', escapeHtml(ogImage));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), weddingMetaPlugin()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) return 'motion';
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
});
