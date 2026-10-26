'use client'

import Image from 'next/image'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

import type { Media } from '@/payload-types'
import { labelFor, MEDIA_CATEGORIES } from '@/lib/constants'
import { cx } from '@/lib/cx'
import { isVideo, mediaSrc } from '@/lib/media'
import { Tx } from '@/lib/text'

import { Frame } from '../media/Img'
import { Icon } from '../ui/Icon'

/** Filterable masonry of photographs with an accessible full-screen viewer. */
export function Gallery({ items }: { items: Media[] }) {
  const [filter, setFilter] = useState('all')
  const [index, setIndex] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  const categories = MEDIA_CATEGORIES.map((c) => ({ ...c, count: items.filter((m) => m.category === c.value).length })).filter(
    (c) => c.count > 0,
  )
  const shown = filter === 'all' ? items : items.filter((m) => m.category === filter)
  const current = index === null ? null : shown[index]

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (index !== null && !el.open) el.showModal()
    if (index === null && el.open) el.close()
  }, [index])

  const step = (delta: number) => setIndex((i) => (i === null ? null : (i + delta + shown.length) % shown.length))

  const onKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }

  return (
    <>
      {categories.length > 1 && (
        <div className="gallery-toolbar">
          <div className="chips" role="group" aria-label="Filter photographs">
            <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
              All <span className="chip__count">{items.length}</span>
            </button>
            {categories.map((c) => (
              <button key={c.value} type="button" className="chip" aria-pressed={filter === c.value} onClick={() => setFilter(c.value)}>
                {c.label} <span className="chip__count">{c.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="masonry">
        {shown.map((media, i) => (
          <figure key={media.id}>
            <button type="button" className="masonry__item" onClick={() => setIndex(i)} aria-label={`Open: ${media.alt}`}>
              <Frame media={media} ratio="auto" sizes="(min-width: 900px) 30vw, (min-width: 520px) 46vw, 100vw" reveal={false} />
            </button>
            {(media.caption || media.credit) && (
              <figcaption className="caption">
                <span>
                  <Tx>{media.caption}</Tx>
                </span>
                {media.credit && <small>{media.credit}</small>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <dialog ref={dialog} className="lightbox" aria-label="Photograph viewer" onClose={() => setIndex(null)} onKeyDown={onKey}>
        {current && (
          <div className="lightbox__inner">
            <button type="button" className="lightbox__btn lightbox__btn--close" onClick={() => setIndex(null)}>
              <Icon name="close" size={20} />
              <span className="sr-only">Close</span>
            </button>
            {shown.length > 1 && (
              <>
                <button type="button" className="lightbox__btn lightbox__btn--prev" onClick={() => step(-1)}>
                  <Icon name="arrow-left" size={20} />
                  <span className="sr-only">Previous</span>
                </button>
                <button type="button" className="lightbox__btn lightbox__btn--next" onClick={() => step(1)}>
                  <Icon name="arrow-right" size={20} />
                  <span className="sr-only">Next</span>
                </button>
              </>
            )}
            <div className="lightbox__stage">
              {isVideo(current) ? (
                <video key={current.id} src={mediaSrc(current)} controls autoPlay playsInline />
              ) : (
                <Image
                  key={current.id}
                  src={mediaSrc(current)}
                  alt={current.alt}
                  width={current.width ?? 1600}
                  height={current.height ?? 1067}
                  sizes="100vw"
                  quality={80}
                  loading="eager"
                  placeholder={current.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={current.blurDataUrl ?? undefined}
                />
              )}
            </div>
            <div className="lightbox__caption">
              <p className={cx('caption')}>
                <Tx>{current.caption || current.alt}</Tx>
                {current.credit ? ` — ${current.credit}` : ''}
              </p>
              <p className="lightbox__counter">
                {index! + 1} / {shown.length}
                {current.category ? ` · ${labelFor(MEDIA_CATEGORIES, current.category)}` : ''}
              </p>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
