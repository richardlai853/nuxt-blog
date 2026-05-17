<script setup lang="ts">
import type { BlogPost } from '~/utils/posts'

const config = useRuntimeConfig()

const { data: posts } = await useAsyncData('home-posts', async () => {
  const items = await queryCollection('posts')
    .order('date', 'DESC')
    .all()

  return (items as BlogPost[]).filter(post => !post.draft)
})

const featuredPosts = computed(() => (posts.value || []).slice(0, 3))

const tagCounts = computed(() => {
  const counts = new Map<string, number>()

  for (const post of posts.value || []) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
})

useSeoMeta({
  title: 'Home',
  description: 'Nuxt Blog with posts, tags, and content discovery.',
  ogTitle: `Home · ${config.public.siteName}`,
  ogDescription: 'Nuxt Blog with posts, tags, and content discovery.',
  ogType: 'website',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: new URL('/', config.public.siteUrl).toString(),
    },
  ],
}))
</script>

<template>
  <section class="card hero">
    <h1>{{ config.public.siteName }}</h1>
    <p>
      Content-first blog built on Nuxt. Browse recent articles, discover tags, and read long-form content.
    </p>
    <div class="hero-actions">
      <NuxtLink to="/posts">Browse Posts</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
    </div>
  </section>

  <section class="section">
    <h2>Featured posts</h2>
    <div class="stack">
      <PostCard v-for="post in featuredPosts" :key="post.id" :post="post" />
      <p v-if="!featuredPosts.length">No posts published yet.</p>
    </div>
  </section>

  <section class="section">
    <h2>Popular tags</h2>
    <div class="tags" v-if="tagCounts.length">
      <NuxtLink v-for="[tag, count] in tagCounts" :key="tag" :to="`/tags/${encodeURIComponent(tag)}`" class="tag">
        #{{ tag }} ({{ count }})
      </NuxtLink>
    </div>
    <p v-else>No tags available yet.</p>
  </section>
</template>

<style scoped>
.hero {
  margin-bottom: 1.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.section {
  margin-top: 1.5rem;
}

.stack {
  display: grid;
  gap: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
