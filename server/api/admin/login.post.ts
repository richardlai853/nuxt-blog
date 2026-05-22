import { isAdminAuthConfigured, setAdminSession, validateAdminCredentials } from '../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  if (!isAdminAuthConfigured(event)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication service unavailable',
    })
  }

  const body = await readBody<{ username?: string, password?: string }>(event)
  const username = String(body?.username || '')
  const password = String(body?.password || '')

  if (!validateAdminCredentials(event, username, password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password',
    })
  }

  setAdminSession(event)
  return { ok: true }
})
