<script>
export default {
  async asyncData({ $content, params }) {
    const article = await $content("articles", params.slug).fetch();

    const [prev, next] = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('createdAt', 'asc')
      .surround(params.slug)
      .fetch()

    return { article, prev, next };
  },

  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en", options);
    },
  },
};
</script>
<style>
.nuxt-content h1 {
  font-weight: bold;
  font-size: 32px;
}
.nuxt-content h2 {
  font-weight: bold;
  font-size: 22px;
}
.nuxt-content p {
  margin-bottom: 20px;
}
.icon.icon-link {
  background-image: url("~assets/svg/icon-home.svg");
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
}
</style>
<template>
  <article class="m-8">
    <AppSearchInput />
    <h1 class="text-3xl font-bold underline">{{ article.title }}</h1>
    <p>{{ article.description }}</p>
    <p>{{ article.img }}</p>
    <img :src="article.img" :alt="article.alt" />
    <p>Article last updated: {{ formatDate(article.updatedAt) }}</p>
    <nav>
      <ul>
        <li v-for="link of article.toc" :key="link.id">
          <NuxtLink :to="`#${link.id}`" :class="{ 'py-2': link.depth === 2, 'ml-2 pb-2': link.depth === 3 }">{{ link.text }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <nuxt-content :document="article" />
    <author :author="article.author" />
    <prev-next :prev="prev" :next="next" />
  </article>
</template>
