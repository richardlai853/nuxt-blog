import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export const adminSessionCookie = 'nuxt_blog_admin_session'
const adminSessionMaxAgeSeconds = 28800

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

const safeEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

const signPayload = (payload: string, secret: string): string => {
  return createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

const encodeToken = (payload: string, signature: string): string => {
  return Buffer.from(`${payload}.${signature}`).toString('base64url')
}

const decodeToken = (token: string): { payload: string, signature: string } | null => {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const separatorIndex = decoded.lastIndexOf('.')

    if (separatorIndex <= 0 || separatorIndex === decoded.length - 1) {
      return null
    }

    return {
      payload: decoded.slice(0, separatorIndex),
      signature: decoded.slice(separatorIndex + 1),
    }
  }
  catch {
    return null
  }
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

  const decoded = decodeToken(session)

  if (!decoded) {
    return false
  }

  const expectedSignature = signPayload(decoded.payload, config.adminSessionSecret)

  if (!safeEqual(decoded.signature, expectedSignature)) {
    return false
  }

  const [username, issuedAtRaw] = decoded.payload.split(':')
  const issuedAt = Number(issuedAtRaw)

  if (!username || Number.isNaN(issuedAt)) {
    return false
  }

  if (!safeEqual(username, config.adminUser)) {
    return false
  }

  return Date.now() - issuedAt <= adminSessionMaxAgeSeconds * 1000
}

export const setAdminSession = (event: H3Event): void => {
  const config = getAdminAuthConfig(event)
  const payload = `${config.adminUser}:${Date.now()}`
  const token = encodeToken(payload, signPayload(payload, config.adminSessionSecret))

  setCookie(event, adminSessionCookie, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: adminSessionMaxAgeSeconds,
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
