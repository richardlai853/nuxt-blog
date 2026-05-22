// https://nuxt.com/docs/api/configuration/nuxt-config
import { randomBytes } from 'node:crypto'

const developmentAdminSessionSecret = randomBytes(32).toString('hex')

if (
  process.env.NODE_ENV === 'production'
  && (process.env.NUXT_ADMIN_USER || process.env.NUXT_ADMIN_PASSWORD)
  && !process.env.NUXT_ADMIN_SESSION_SECRET
) {
  throw new Error('NUXT_ADMIN_SESSION_SECRET must be set in production')
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  routeRules: {
    '/admin': { prerender: false },
    '/admin/**': { prerender: false },
  },
  runtimeConfig: {
    adminUser: process.env.NUXT_ADMIN_USER || '',
    adminPassword: process.env.NUXT_ADMIN_PASSWORD || '',
    adminSessionSecret: process.env.NUXT_ADMIN_SESSION_SECRET || developmentAdminSessionSecret,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Nuxt Blog',
      analyticsId: process.env.NUXT_PUBLIC_ANALYTICS_ID || '',
    },
  },
  app: {
    head: {
      titleTemplate: '%s · Nuxt Blog',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A content-first blog built with Nuxt and Nuxt Content.' },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ['/rss.xml', '/sitemap.xml'],
    },
  },
})
