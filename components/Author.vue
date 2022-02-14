<script>
export default {
  props: {
    author: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <div>
    <NuxtLink :to="`/blog/author/${author.name}`">
      <div>
        <h4>Author</h4>
        <p>{{ author.name }}</p>
        <p>{{ author.bio }}</p>
      </div>
    </NuxtLink>
  </div>
</template>
