<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const config = useRuntimeConfig()

useSeoMeta({
  title: page.value.title,
  description: page.value.description || 'Content page',
  ogTitle: page.value.title,
  ogDescription: page.value.description || 'Content page',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: new URL(route.path, config.public.siteUrl).toString(),
    },
  ],
}))
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>
