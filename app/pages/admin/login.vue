<script setup lang="ts">
const config = useRuntimeConfig()
const username = ref('')
const password = ref('')
const pending = ref(false)
const errorMessage = ref('')

useSeoMeta({
  title: 'Admin Login',
  description: 'Sign in to access the protected admin workflow.',
})

useHead(() => ({
  link: [{ rel: 'canonical', href: new URL('/admin/login', config.public.siteUrl).toString() }],
}))

const signIn = async () => {
  pending.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
      },
    })

    await navigateTo('/admin')
  }
  catch {
    errorMessage.value = 'Invalid username or password.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="card auth-card">
    <h1>Admin sign in</h1>
    <p class="meta">
      Sign in with your admin credentials to access the protected publishing workflow.
    </p>

    <form class="auth-form" @submit.prevent="signIn">
      <label>
        Username
        <input
          v-model="username"
          type="text"
          autocomplete="username"
          required
        >
      </label>

      <label>
        Password
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        >
      </label>

      <button type="submit" :disabled="pending">
        {{ pending ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
  </section>
</template>

<style scoped>
.auth-card {
  max-width: 480px;
  margin: 0 auto;
}

.auth-form {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

label {
  display: grid;
  gap: 0.4rem;
  color: #334155;
}

input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.6rem 0.7rem;
  font: inherit;
}

button {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #ffffff;
  border-radius: 0.5rem;
  padding: 0.6rem 0.9rem;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  color: #b91c1c;
}
</style>
