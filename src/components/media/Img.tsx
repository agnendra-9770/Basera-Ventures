import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

import type { Media } from '@/payload-types'
import { cx } from '@/lib/cx'
import { asMedia, focalPosition, isVideo, mediaSrc } from '@/lib/media'

import { ArchMark } from '../ui/ArchMark'

type ImgProps = {
  media?: unknown
  /** Tells the browser how wide the image will be shown, e.g. "(min-width: 900px) 50vw, 100vw". */
  sizes: string
  /** Load immediately (use for the largest image in the first screen). */
  preload?: boolean
  quality?: 70 | 80
  className?: string
  alt?: string
  /** Shown on the placeholder when no photograph has been chosen yet. */
  label?: string
  /** Render at the photograph's own proportions instead of filling a frame. */
  intrinsic?: boolean
}

/** A designed stand-in that is obviously not a real photograph. */
export function PlaceholderMedia({ label, compact }: { label?: string; compact?: boolean }) {
  return (
    <div className={cx('ph-media', compact && 'ph-media--compact')} role="img" aria-label={`Photograph to come${label ? `: ${label}` : ''}`}>
      <div className="ph-media__inner">
        <ArchMark className="ph-media__mark" />
        {!compact && <p className="ph-media__label">{label ?? 'Your photograph here'}</p>}
        <p className="ph-media__hint">Photograph to come</p>
      </div>
    </div>
  )
}

export function Img({ media, sizes, preload, quality = 70, className, alt, label, intrinsic }: ImgProps) {
  const doc = asMedia(media)
  if (!doc) return <PlaceholderMedia label={label} />

  const visual: Media | null = isVideo(doc) ? asMedia(doc.poster) : doc
  if (!visual) {
    // A video without a thumbnail: show its first frame.
    return (
      <video
        className={cx('media-fill', className)}
        src={mediaSrc(doc)}
        muted
        playsInline
        preload="metadata"
        aria-label={alt ?? doc.alt}
      />
    )
  }

  const shared = {
    src: mediaSrc(visual),
    alt: alt ?? visual.alt ?? '',
    sizes,
    quality,
    className,
    placeholder: visual.blurDataUrl ? ('blur' as const) : ('empty' as const),
    blurDataURL: visual.blurDataUrl ?? undefined,
    preload,
    loading: preload ? ('eager' as const) : ('lazy' as const),
    fetchPriority: preload ? ('high' as const) : undefined,
  }

  if (intrinsic && visual.width && visual.height) {
    return <Image {...shared} width={visual.width} height={visual.height} />
  }

  return <Image {...shared} fill style={{ objectFit: 'cover', objectPosition: focalPosition(visual) }} />
}

export type Ratio = '4x5' | '3x4' | '2x3' | '1x1' | '4x3' | '3x2' | '16x10' | '16x9' | '21x9' | 'auto'

/** An image in a fixed-proportion frame; `arch` crops the top into the brand arch. */
export function Frame({
  media,
  ratio = '4x5',
  arch,
  sizes,
  preload,
  label,
  className,
  reveal = true,
  caption,
  children,
  style,
}: {
  media?: unknown
  ratio?: Ratio
  arch?: boolean
  sizes: string
  preload?: boolean
  label?: string
  className?: string
  reveal?: boolean
  caption?: ReactNode
  children?: ReactNode
  style?: CSSProperties
}) {
  const doc = asMedia(media)
  const autoRatio =
    ratio === 'auto' && doc?.width && doc?.height ? { aspectRatio: `${doc.width} / ${doc.height}` } : undefined
  const frame = (
    <div
      className={cx('frame', `frame--${ratio}`, arch && 'arch')}
      data-reveal={reveal ? 'image' : undefined}
      style={{ ...autoRatio, ...style }}
    >
      <Img media={media} sizes={sizes} preload={preload} label={label} />
      {children}
    </div>
  )
  if (!caption) return className ? <div className={className}>{frame}</div> : frame
  return (
    <figure className={cx('figure', className)}>
      {frame}
      <figcaption className="caption">{caption}</figcaption>
    </figure>
  )
}
