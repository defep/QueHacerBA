import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },

  modules: [],

  compatibilityDate: '2024-01-01',

  typescript: {
    strict: true,
    shim: false,
  },

  alias: {
    '@': './src',
    '~': './src',
  },
});
