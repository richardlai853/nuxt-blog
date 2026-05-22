import { createHash, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export const adminSessionCookie = 'nuxt_blog_admin_session'

type AdminAuthConfig = {
  adminUser: string
  adminPassword: string
  adminSessionSecret: string
}

const getAdminAuthConfig = (event: H3Event): AdminAuthConfig => {
  const config = useRuntimeConfig(event)
  return {
    adminUser: String(config.adminUser || ''),
    adminPassword: String(config.adminPassword || ''),
    adminSessionSecret: String(config.adminSessionSecret || ''),
  }
}

export const isAdminAuthConfigured = (event: H3Event): boolean => {
  const config = getAdminAuthConfig(event)
  return Boolean(config.adminUser && config.adminPassword && config.adminSessionSecret)
}

const createAdminSessionToken = (config: AdminAuthConfig): string => {
  return createHash('sha256')
    .update(`${config.adminUser}:${config.adminPassword}:${config.adminSessionSecret}`)
    .digest('hex')
}

const safeEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export const validateAdminCredentials = (
  event: H3Event,
  username: string,
  password: string,
): boolean => {
  const config = getAdminAuthConfig(event)

  return safeEqual(username, config.adminUser) && safeEqual(password, config.adminPassword)
}

export const isAdminAuthenticated = (event: H3Event): boolean => {
  if (!isAdminAuthConfigured(event)) {
    return false
  }

  const config = getAdminAuthConfig(event)
  const session = getCookie(event, adminSessionCookie)

  if (!session) {
    return false
  }

  return safeEqual(session, createAdminSessionToken(config))
}

export const setAdminSession = (event: H3Event): void => {
  const config = getAdminAuthConfig(event)

  setCookie(event, adminSessionCookie, createAdminSessionToken(config), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
  })
}

export const clearAdminSession = (event: H3Event): void => {
  deleteCookie(event, adminSessionCookie, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}
