<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  script: config.public.analyticsId
    ? [{
        src: `https://www.googletagmanager.com/gtag/js?id=${config.public.analyticsId}`,
        async: true,
      }, {
        children: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${config.public.analyticsId}');
`,
      }]
    : [],
})
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <nav class="site-nav">
        <NuxtLink to="/" class="logo">Nuxt Blog</NuxtLink>
        <div class="links">
          <NuxtLink to="/posts">Posts</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/admin">Admin</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="site-main">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <p>© {{ new Date().getFullYear() }} {{ config.public.siteName }}</p>
    </footer>
  </div>
</template>

<style>
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
  color: #111827;
  background: #f8fafc;
}

a {
  color: #0f766e;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.site-nav {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-weight: 700;
  color: #111827;
  text-decoration: none;
}

.links {
  display: flex;
  gap: 1rem;
}

.links a {
  text-decoration: none;
  color: #334155;
}

.links a.router-link-active {
  color: #0f766e;
  font-weight: 600;
}

.site-main {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.site-footer {
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
  text-align: center;
  color: #64748b;
  background: #ffffff;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
}

.meta {
  color: #64748b;
  font-size: 0.9rem;
}

.tag {
  display: inline-block;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  color: #334155;
  text-decoration: none;
}
</style>
