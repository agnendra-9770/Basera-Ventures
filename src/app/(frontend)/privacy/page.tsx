import type { Metadata } from 'next'

import { RichText } from '@/components/RichText'
import { PageHead } from '@/components/ui/PageHead'
import { getPages, getSite } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, pages] = await Promise.all([getSite(), getPages()])
  return pageMetadata(site, { path: '/privacy', title: `Privacy notice — ${site.brand}`, seo: pages.privacy?.seo })
}

export default async function PrivacyPage() {
  const pages = await getPages()
  const p = pages.privacy
  return (
    <>
      <PageHead
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: '/privacy' },
        ]}
        eyebrow={p?.eyebrow ?? 'Privacy'}
        heading={p?.heading ?? 'Privacy *notice*'}
        intro={p?.intro}
      />
      <section className="section section--flush-top">
        <div className="container container--text">
          <RichText data={p?.body} />
        </div>
      </section>
    </>
  )
}
