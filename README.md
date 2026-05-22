# Nuxt Blog

A content-driven blog application powered by Nuxt 4 and Nuxt Content.

## Implemented foundation

- Content collections for static pages and blog posts
- Frontmatter schema for posts (`title`, `description`, `date`, `tags`, `draft`)
- Public pages:
  - `/` home
  - `/posts` list with search + tag filtering
  - `/posts/[slug]` post detail with table of contents and related posts
  - `/tags/[tag]` posts by tag
  - `/admin` publishing workflow placeholder
- SEO defaults and canonical URLs
- `robots.txt`, `/sitemap.xml`, and `/rss.xml`
- Optional analytics script via `NUXT_PUBLIC_ANALYTICS_ID`

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Generate static output

```bash
npm run generate
```

## Content authoring

Add markdown files under `/content/posts` using this frontmatter:

```md
---
title: Post title
description: Short summary
date: 2026-05-01
tags:
  - nuxt
  - content
draft: false
---
```
