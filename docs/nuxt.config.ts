import { resolve } from 'node:path'

export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  // features: {
  //   devLogs: false,
  // },

  typescript: {
    includeWorkspace: true,
  },

  devtools: { enabled: false },

  nitro: {
    devProxy: {
      host: '127.0.0.1',
    },
    prerender: {
      crawlLinks: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/getting-started': { prerender: true },
    '/features': { prerender: true },
    '/api': { prerender: true },
    '/api/search.json': { prerender: true },
  },

  vite: {
    $client: {
      build: {
        rollupOptions: {
          output: {
            chunkFileNames: '_nuxt/[name]-[hash].js',
            entryFileNames: '_nuxt/[name]-[hash].js',
          },
        },
      },
    },
  },

  alias: {
    '@vueuse/motion': resolve(__dirname, '../src/index.ts'),
    '@vueuse/motion/nuxt': resolve(__dirname, '../src/nuxt/src/module.ts'),
  },

  modules: [
    '@vueuse/motion/nuxt',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    'nuxt-og-image',
    '@nuxt/fonts',
  ],

  ui: {
    icons: ['simple-icons'],
  },

  // special license for nuxt & nuxt-modules orgs
  uiPro: { license: 'oss' },

  // SEO
  site: { url: 'https://motion.vueuse.org' },

  // Nuxt Content
  content: {},

  // Fonts
  googleFonts: {
    display: 'swap',
    download: true,
    families: { 'DM+Sans': [400, 500, 600, 700] },
  },

  compatibilityDate: '2024-10-09',
})
