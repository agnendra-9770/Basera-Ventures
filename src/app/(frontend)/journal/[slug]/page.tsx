import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BookCta } from '@/components/booking/BookCta'
import { Frame } from '@/components/media/Img'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, JsonLd } from '@/components/ui/Primitives'
import type { Stay } from '@/payload-types'
import { JOURNAL_CATEGORIES, labelFor } from '@/lib/constants'
import { getPayloadClient, getPost, getSite } from '@/lib/data'
import { formatDate, readingMinutes } from '@/lib/format'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { Tx } from '@/lib/text'

export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'journal',
    draft: false,
    limit: 500,
    pagination: false,
    overrideAccess: false,
    select: { slug: true },
  })
  return result.docs.filter((d) => d.slug).map((d) => ({ slug: d.slug as string }))
}

const countWords = (node: unknown): number => {
  if (!node || typeof node !== 'object') return 0
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  if (n.root) return countWords(n.root)
  let count = typeof n.text === 'string' ? n.text.split(/\s+/).filter(Boolean).length : 0
  for (const child of n.children ?? []) count += countWords(child)
  return count
}

type Args = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const [site, post] = await Promise.all([getSite(), getPost(decodeURIComponent(slug))])
  if (!post) return {}
  return pageMetadata(site, {
    path: `/journal/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    seo: post.seo,
    image: post.coverImage,
    type: 'article',
    publishedTime: post.publishedAt,
  })
}

export default async function PostPage({ params }: Args) {
  const { slug } = await params
  const [site, post] = await Promise.all([getSite(), getPost(decodeURIComponent(slug))])
  if (!post) notFound()

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/journal' },
    { name: post.title, path: `/journal/${post.slug}` },
  ]
  const stays = (post.relatedStays ?? []).filter((s): s is Stay => typeof s === 'object' && s !== null)
  const minutes = readingMinutes(countWords(post.body))

  return (
    <article>
      <JsonLd data={[articleSchema(site, post), breadcrumbSchema(site, trail)]} />
      <div className="container">
        <header className="article-head">
          <Breadcrumbs trail={trail} />
          <p className="article-meta">
            <span>{labelFor(JOURNAL_CATEGORIES, post.category)}</span>
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
            {post.author && <span>By {post.author}</span>}
            <span>{minutes} min read</span>
          </p>
          <h1 className="display-l">
            <Tx>{post.title}</Tx>
          </h1>
          <p className="lead text-soft">
            <Tx>{post.excerpt}</Tx>
          </p>
        </header>
        {post.coverImage && (
          <div className="article-cover">
            <Frame media={post.coverImage} ratio="16x9" sizes="(min-width: 1480px) 1480px, 100vw" preload reveal={false} />
          </div>
        )}
        <div className="article-body">
          <RichText data={post.body} />
        </div>
        <footer className="article-foot">
          {stays.length > 0 && (
            <div>
              <p className="label" style={{ marginBottom: '0.75rem' }}>
                Stays mentioned
              </p>
              <div className="related-stays chip-links">
                {stays.map((stay) => (
                  <Link key={stay.id} className="chip" href={`/stays/${stay.slug}`}>
                    <Tx>{stay.name}</Tx>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="section-cta">
            <h2 className="display-m">Come and *see for yourself*</h2>
            <BookCta site={site} icon="arrow-right" />
          </div>
        </footer>
      </div>
    </article>
  )
}
