import { isAdminAuthenticated } from '../utils/admin-auth'

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApi = pathname.startsWith('/api/admin/')

  if (!isAdminPage && !isAdminApi) {
    return
  }

  const isLoginPath = pathname === '/admin/login' || pathname === '/api/admin/login'

  if (isLoginPath) {
    return
  }

  if (isAdminAuthenticated(event)) {
    return
  }

  if (isAdminPage) {
    await sendRedirect(event, '/admin/login', 302)
    return
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
  })
})
