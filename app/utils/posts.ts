export type TocLink = {
  id: string
  depth: number
  text: string
  children?: TocLink[]
}

export type BlogPost = {
  id: string
  path: string
  title: string
  description: string
  date: string
  updatedAt?: string
  tags?: string[]
  draft?: boolean
  body?: {
    toc?: {
      links?: TocLink[]
    }
    [key: string]: unknown
  }
}

function collectText(node: unknown): string {
  if (!node) {
    return ''
  }

  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join(' ')
  }

  if (typeof node === 'object') {
    return Object.values(node as Record<string, unknown>).map(collectText).join(' ')
  }

  return ''
}

export function estimateReadingTimeFromBody(body: unknown) {
  const words = collectText(body).trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function normalizeTag(tag: string) {
  return tag.trim().toLowerCase()
}

export function buildRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit = 3) {
  const currentTags = new Set((currentPost.tags || []).map(normalizeTag))

  return allPosts
    .filter(post => post.path !== currentPost.path && !post.draft)
    .map(post => {
      const overlap = (post.tags || []).filter(tag => currentTags.has(normalizeTag(tag))).length
      return { post, overlap }
    })
    .filter(item => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(item => item.post)
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
