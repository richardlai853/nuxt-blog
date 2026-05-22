<script setup lang="ts">
const config = useRuntimeConfig()
const pending = ref(false)
const errorMessage = ref('')

useSeoMeta({
  title: 'Admin',
  description: 'Protected authoring and publishing workflow.',
})

useHead(() => ({
  link: [{ rel: 'canonical', href: new URL('/admin', config.public.siteUrl).toString() }],
}))

const signOut = async () => {
  pending.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
    await navigateTo('/admin/login')
  }
  catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to sign out. Please try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="card">
    <h1>Admin workflow</h1>
    <p class="meta">
      You are signed in. Use this protected workflow for drafting and publishing content updates.
    </p>
    <ul>
      <li>Create a post in <code>/content/posts</code></li>
      <li>Add frontmatter: title, description, date, tags, draft</li>
      <li>Preview with <code>npm run dev</code></li>
      <li>Publish by setting <code>draft: false</code></li>
    </ul>
    <button type="button" :disabled="pending" @click="signOut">
      {{ pending ? 'Signing out…' : 'Sign out' }}
    </button>
    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
  </section>
</template>

<style scoped>
button {
  margin-top: 0.6rem;
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #ffffff;
  border-radius: 0.5rem;
  padding: 0.55rem 0.85rem;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  margin-top: 0.8rem;
  color: #b91c1c;
}
</style>
