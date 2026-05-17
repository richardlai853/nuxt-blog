<script setup lang="ts">
import { buildRelatedPosts, estimateReadingTimeFromBody, formatDate, type BlogPost } from '~/utils/posts'

const route = useRoute()
const config = useRuntimeConfig()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const postPath = `/posts/${slug}`

const { data: post } = await useAsyncData(`post-${postPath}`, async () => {
  return await queryCollection('posts').path(postPath).first() as BlogPost | null
})

if (!post.value || post.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: allPosts } = await useAsyncData('all-posts-for-related', async () => {
  const items = await queryCollection('posts').order('date', 'DESC').all()
  return items as BlogPost[]
})

const readingTime = computed(() => estimateReadingTimeFromBody(post.value?.body))
const relatedPosts = computed(() => buildRelatedPosts(post.value as BlogPost, allPosts.value || []))
const tocLinks = computed(() => post.value?.body?.toc?.links || [])

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  articlePublishedTime: post.value.date,
  articleModifiedTime: post.value.updatedAt,
  ogType: 'article',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: new URL(postPath, config.public.siteUrl).toString(),
    },
  ],
}))
</script>

<template>
  <article class="card">
    <header>
      <h1>{{ post?.title }}</h1>
      <p class="meta">
        {{ formatDate(post!.date) }} · {{ readingTime }} min read
      </p>
      <p>{{ post?.description }}</p>
      <div class="tags" v-if="post?.tags?.length">
        <NuxtLink v-for="tag in post.tags" :key="tag" :to="`/tags/${encodeURIComponent(tag)}`" class="tag">
          #{{ tag }}
        </NuxtLink>
      </div>
    </header>

    <aside v-if="tocLinks.length" class="toc">
      <h2>Table of contents</h2>
      <ul>
        <li v-for="link in tocLinks" :key="link.id">
          <a :href="`#${link.id}`">{{ link.text }}</a>
        </li>
      </ul>
    </aside>

    <ContentRenderer :value="post!" />
  </article>

  <section class="related" v-if="relatedPosts.length">
    <h2>Related posts</h2>
    <div class="grid">
      <PostCard v-for="related in relatedPosts" :key="related.id" :post="related" />
    </div>
  </section>
</template>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.toc {
  margin: 1rem 0;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.toc h2 {
  margin-top: 0;
  font-size: 1rem;
}

.related {
  margin-top: 2rem;
}

.grid {
  display: grid;
  gap: 1rem;
}
</style>
