<script setup lang="ts">
import { normalizeTag, type BlogPost } from '~/utils/posts'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const search = ref(String(route.query.q || ''))
const selectedTag = ref(String(route.query.tag || ''))

const { data: posts } = await useAsyncData('posts', async () => {
  const items = await queryCollection('posts').order('date', 'DESC').all()
  return (items as BlogPost[]).filter(post => !post.draft)
})

const allTags = computed(() => {
  const tags = new Set<string>()
  for (const post of posts.value || []) {
    for (const tag of post.tags || []) {
      tags.add(tag)
    }
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b))
})

const filteredPosts = computed(() => {
  const query = search.value.trim().toLowerCase()
  const tagFilter = normalizeTag(selectedTag.value)

  return (posts.value || []).filter((post) => {
    const text = `${post.title} ${post.description} ${(post.tags || []).join(' ')}`.toLowerCase()
    const matchesSearch = !query || text.includes(query)
    const matchesTag = !tagFilter || (post.tags || []).some(tag => normalizeTag(tag) === tagFilter)
    return matchesSearch && matchesTag
  })
})

watch([search, selectedTag], async ([q, tag]) => {
  await router.replace({
    query: {
      ...(q ? { q } : {}),
      ...(tag ? { tag } : {}),
    },
  })
})

useSeoMeta({
  title: 'Posts',
  description: 'Browse and search all published blog posts.',
  ogTitle: `Posts · ${config.public.siteName}`,
  ogDescription: 'Browse and search all published blog posts.',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: new URL('/posts', config.public.siteUrl).toString(),
    },
  ],
}))
</script>

<template>
  <section class="card">
    <h1>All posts</h1>
    <p class="meta">Search by keyword and filter by tag.</p>

    <div class="filters">
      <input v-model="search" type="search" placeholder="Search posts..." />
      <select v-model="selectedTag">
        <option value="">All tags</option>
        <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
    </div>
  </section>

  <section class="list">
    <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
    <p v-if="!filteredPosts.length">No posts matched your filters.</p>
  </section>
</template>

<style scoped>
.filters {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.6rem 0.75rem;
  font: inherit;
}

.list {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
}
</style>
