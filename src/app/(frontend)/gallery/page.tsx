import type { Metadata } from 'next'

import { Gallery } from '@/components/gallery/Gallery'
import { Frame } from '@/components/media/Img'
import { PageHead } from '@/components/ui/PageHead'
import { JsonLd, SectionHead } from '@/components/ui/Primitives'
import { SetupNote } from '@/components/ui/SetupNote'
import { getGalleryMedia, getPages, getPostcards, getSite } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { Tx } from '@/lib/text'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, pages, media] = await Promise.all([getSite(), getPages(), getGalleryMedia()])
  const p = pages.gallery
  return pageMetadata(site, {
    path: '/gallery',
    title: `Photo gallery — ${site.brand}, ${site.settings.location}`,
    description: p?.intro,
    seo: p?.seo,
    image: p?.image ?? media[0],
  })
}

export default async function GalleryPage() {
  const [site, pages, media, postcards] = await Promise.all([getSite(), getPages(), getGalleryMedia(), getPostcards()])
  const p = pages.gallery
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
  ]

  return (
    <>
      <JsonLd data={breadcrumbSchema(site, trail)} />
      <PageHead trail={trail} eyebrow={p?.eyebrow ?? 'Gallery'} heading={p?.heading ?? 'The visual *journal*'} intro={p?.intro} />

      <section className="section section--flush-top">
        <div className="container">
          {media.length > 0 ? (
            <Gallery items={media} />
          ) : (
            !site.isLive && (
              <SetupNote title="Upload your photographs" href="/admin/collections/media" action="Open the media library">
                <p>Drop in several files at once. Give each a plain description, a category for the filters, and tick “Show in the gallery”.</p>
              </SetupNote>
            )
          )}
        </div>
      </section>

      {(postcards.length > 0 || !site.isLive) && (
        <section className="section section--linen">
          <div className="container">
            <SectionHead eyebrow="Postcards" heading={p?.postcardsHeading ?? 'Postcards *from here*'} intro={p?.postcardsIntro} align="center" size="m" />
            {postcards.length > 0 ? (
              <ul className="postcards">
                {postcards.map((card, i) => (
                  <li key={card.id} className="postcard" data-reveal style={{ ['--d' as string]: i % 4 }}>
                    <figure>
                      <Frame media={card} ratio="auto" sizes="(min-width: 760px) 300px, 90vw" reveal={false} />
                      <figcaption>
                        {card.caption && (
                          <span className="caption">
                            <Tx>{card.caption}</Tx>
                          </span>
                        )}
                        {card.credit && <span className="postcard__credit">{card.credit}</span>}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            ) : (
              <SetupNote title="Choose a few postcards" href="/admin/collections/media" action="Open the media library">
                <p>Tick “Feature in Postcards from here” on scenic photographs and on moments guests have shared (with their permission).</p>
              </SetupNote>
            )}
          </div>
        </section>
      )}
    </>
  )
}
