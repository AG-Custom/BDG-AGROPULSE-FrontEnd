import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const quasarVariables = fileURLToPath(new URL('./src/css/quasar.variables.scss', import.meta.url));

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: quasarVariables,
    }),
  ],
  resolve: {
    alias: {
      assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
      boot: fileURLToPath(new URL('./src/boot', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      composables: fileURLToPath(new URL('./src/composables', import.meta.url)),
      constants: fileURLToPath(new URL('./src/constants', import.meta.url)),
      css: fileURLToPath(new URL('./src/css', import.meta.url)),
      layouts: fileURLToPath(new URL('./src/layouts', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      router: fileURLToPath(new URL('./src/router', import.meta.url)),
      services: fileURLToPath(new URL('./src/services', import.meta.url)),
      stores: fileURLToPath(new URL('./src/stores', import.meta.url)),
      types: fileURLToPath(new URL('./src/types', import.meta.url)),
      utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
});
