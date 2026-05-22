<script setup lang="ts">
import { formatDate, type BlogPost } from '~/utils/posts'

defineProps<{
  post: BlogPost
}>()
</script>

<template>
  <article class="card">
    <h2>
      <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
    </h2>
    <p>{{ post.description }}</p>
    <p class="meta">{{ formatDate(post.date) }}</p>
    <div class="tags" v-if="post.tags?.length">
      <NuxtLink
        v-for="tag in post.tags"
        :key="tag"
        :to="`/tags/${encodeURIComponent(tag)}`"
        class="tag"
      >
        #{{ tag }}
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped>
h2 {
  margin-top: 0;
}

h2 a {
  color: #0f172a;
  text-decoration: none;
}

h2 a:hover {
  text-decoration: underline;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
