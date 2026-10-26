import type { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'
import type { ReactNode } from 'react'

import { cx } from '@/lib/cx'
import { asMedia } from '@/lib/media'
import { Ph } from '@/lib/text'

import { Frame } from './media/Img'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc
  const value = doc?.value
  const slug = value && typeof value === 'object' && 'slug' in value ? String(value.slug) : ''
  if (doc?.relationTo === 'stays') return `/stays/${slug}`
  if (doc?.relationTo === 'journal') return `/journal/${slug}`
  return '/'
}

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  text: ({ node }) => {
    let content: ReactNode = <Ph text={node.text} />
    if (node.format & 1) content = <strong>{content}</strong>
    if (node.format & 2) content = <em>{content}</em>
    if (node.format & 4) content = <s>{content}</s>
    if (node.format & 8) content = <u>{content}</u>
    if (node.format & 16) content = <code>{content}</code>
    if (node.format & 32) content = <sub>{content}</sub>
    if (node.format & 64) content = <sup>{content}</sup>
    return content
  },
  upload: ({ node }) => {
    const media = asMedia(node.value)
    if (!media) return null
    return (
      <Frame
        media={media}
        ratio="auto"
        sizes="(min-width: 900px) 760px, 100vw"
        caption={media.caption || undefined}
      />
    )
  },
})

export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return (
    <LexicalRichText
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data={data as any}
      converters={converters}
      className={cx('prose', className)}
    />
  )
}
