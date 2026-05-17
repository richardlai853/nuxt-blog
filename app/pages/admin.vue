<script setup lang="ts">
const config = useRuntimeConfig()

useSeoMeta({
  title: 'Admin',
  description: 'Authoring and publishing workflow placeholder.',
})

useHead(() => ({
  link: [{ rel: 'canonical', href: new URL('/admin', config.public.siteUrl).toString() }],
}))
</script>

<template>
  <section class="card">
    <h1>Admin workflow (phase scaffold)</h1>
    <ul>
      <li>Create a post in <code>/content/posts</code></li>
      <li>Add frontmatter: title, description, date, tags, draft</li>
      <li>Preview with <code>npm run dev</code></li>
      <li>Publish by setting <code>draft: false</code></li>
    </ul>
  </section>
</template>
