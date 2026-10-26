import type { Metadata } from 'next'

import { PostCard } from '@/components/home/Sections'
import { PageHead } from '@/components/ui/PageHead'
import { JsonLd, SetupNote } from '@/components/ui/Primitives'
import { JOURNAL_CATEGORIES } from '@/lib/constants'
import { getJournal, getPages, getSite } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, pages] = await Promise.all([getSite(), getPages()])
  const p = pages.journal
  return pageMetadata(site, {
    path: '/journal',
    title: `Journal — guides and stories from ${site.settings.location}`,
    description: p?.intro,
    seo: p?.seo,
    image: p?.image,
  })
}

export default async function JournalPage() {
  const [site, pages, posts] = await Promise.all([getSite(), getPages(), getJournal()])
  const p = pages.journal
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/journal' },
  ]
  const groups = JOURNAL_CATEGORIES.map((c) => ({ ...c, posts: posts.filter((post) => post.category === c.value) })).filter(
    (g) => g.posts.length > 0,
  )

  return (
    <>
      <JsonLd data={breadcrumbSchema(site, trail)} />
      <PageHead trail={trail} eyebrow={p?.eyebrow ?? 'Journal'} heading={p?.heading ?? 'Notes *from here*'} intro={p?.intro} image={p?.image} />
      <section className="section section--flush-top">
        <div className="container">
          {groups.length === 0 && !site.isLive && (
            <SetupNote title="Write your first story" href="/admin/collections/journal/create" action="Add a journal story">
              <p>Guides that answer real questions — how to get here, what each season is like, where to eat — are what guests search for.</p>
            </SetupNote>
          )}
          {groups.map((group) => (
            <div key={group.value} className="exp-section">
              <h2 className="display-m">{group.label}</h2>
              <div className="post-grid">
                {group.posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
