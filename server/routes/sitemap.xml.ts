import { queryCollection } from '@nuxt/content/server'
import { escapeXml } from '../utils/xml'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const posts = await queryCollection(event, 'posts')
    .order('date', 'DESC')
    .all()

  const publishedPosts = posts.filter(post => !post.draft)
  const tags = new Set<string>()

  for (const post of publishedPosts) {
    for (const tag of post.tags || []) {
      tags.add(tag)
    }
  }

  const urls = [
    `${siteUrl}/`,
    `${siteUrl}/posts`,
    `${siteUrl}/about`,
    ...publishedPosts.map(post => `${siteUrl}${post.path}`),
    ...Array.from(tags).map(tag => `${siteUrl}/tags/${encodeURIComponent(tag)}`),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
