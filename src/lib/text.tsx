import { Fragment, type ReactNode } from 'react'

const PLACEHOLDER_SPLIT = /(\[[A-Z0-9][^\]\n]{0,160}\])/g
const IS_PLACEHOLDER = /^\[[A-Z0-9][^\]\n]{0,160}\]$/

const withPlaceholders = (text: string, keyPrefix: string): ReactNode[] =>
  text.split(PLACEHOLDER_SPLIT).map((segment, i) =>
    IS_PLACEHOLDER.test(segment) ? (
      <span key={`${keyPrefix}-${i}`} className="ph" title="Placeholder — replace it in the CMS">
        {segment}
      </span>
    ) : (
      <Fragment key={`${keyPrefix}-${i}`}>{segment}</Fragment>
    ),
  )

/** Styles [PLACEHOLDERS] only — for rich text, where asterisks are literal. */
export function Ph({ text }: { text: string }) {
  return <>{withPlaceholders(text, 'ph')}</>
}

/**
 * Renders CMS text: *asterisks* become italics, and [PLACEHOLDERS] are styled
 * so nobody mistakes them for finished copy.
 */
export function Tx({ children }: { children?: string | null }) {
  if (!children) return null
  return (
    <>
      {children.split(/(\*[^*\n]+\*)/g).map((part, i) =>
        /^\*[^*\n]+\*$/.test(part) ? (
          <em key={i}>{withPlaceholders(part.slice(1, -1), String(i))}</em>
        ) : (
          <Fragment key={i}>{withPlaceholders(part, String(i))}</Fragment>
        ),
      )}
    </>
  )
}

/** Headline split into lines after each sentence, for display typography. */
export function Lines({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  const lines = text.split(/(?<=[.!?](?:\*)?)\s+(?=\S)/)
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={className} style={{ ['--i' as string]: i }}>
          <Tx>{line}</Tx>
        </span>
      ))}
    </>
  )
}

/** Plain text for attributes, meta tags and structured data. */
export const plain = (text?: string | null) => (text ?? '').replace(/\*([^*\n]+)\*/g, '$1').trim()

export const paragraphs = (text?: string | null) =>
  (text ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
