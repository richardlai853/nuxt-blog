<script setup lang="ts">
import { normalizeTag, type BlogPost } from '~/utils/posts'

const route = useRoute()
const config = useRuntimeConfig()
const tag = decodeURIComponent(String(route.params.tag || ''))
const normalizedTag = normalizeTag(tag)

const { data: posts } = await useAsyncData(`tag-${tag}`, async () => {
  const items = await queryCollection('posts').order('date', 'DESC').all()
  return (items as BlogPost[]).filter(post => !post.draft)
})

const taggedPosts = computed(() => {
  return (posts.value || []).filter(post => (post.tags || []).some(t => normalizeTag(t) === normalizedTag))
})

useSeoMeta({
  title: `Tag: ${tag}`,
  description: `Posts filed under ${tag}.`,
  ogTitle: `Tag: ${tag} · ${config.public.siteName}`,
  ogDescription: `Posts filed under ${tag}.`,
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: new URL(`/tags/${encodeURIComponent(tag)}`, config.public.siteUrl).toString(),
    },
  ],
}))
</script>

<template>
  <section class="card">
    <h1>#{{ tag }}</h1>
    <p class="meta">{{ taggedPosts.length }} post(s)</p>
  </section>

  <section class="list">
    <PostCard v-for="post in taggedPosts" :key="post.id" :post="post" />
    <p v-if="!taggedPosts.length">No posts found for this tag.</p>
  </section>
</template>

<style scoped>
.list {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
}
</style>
