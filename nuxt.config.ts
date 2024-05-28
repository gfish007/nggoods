// nuxt.config.js
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
     'vuetify/styles', 
     'vditor/dist/index.css',
     '@/assets/iconfont/iconfont.css',
    ],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    plugins: [
      vuetify()
    ],
  },
})
