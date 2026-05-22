import { queryCollection } from '@nuxt/content/server'
import { escapeXml } from '../utils/xml'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const posts = await queryCollection(event, 'posts')
    .order('date', 'DESC')
    .all()

  const publishedPosts = posts.filter(post => !post.draft)

  const items = publishedPosts.map((post) => {
    const link = `${siteUrl}${post.path}`

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description || '')}</description>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(config.public.siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Latest posts from ${escapeXml(config.public.siteName)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
