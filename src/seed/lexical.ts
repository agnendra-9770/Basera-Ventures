/**
 * Builds Payload rich-text (Lexical) documents from a tiny markdown-like
 * format, so seed content stays readable:
 *   'A paragraph with *italics*, **bold** and [a link](/experiences).'
 *   { h2: 'Heading' }, { ul: ['one', 'two'] }, { quote: '…' }, { image: mediaId }
 */

type Block = string | { h2: string } | { h3: string } | { ul: string[] } | { quote: string } | { image: number }

let counter = 0
const nodeId = () => `seed${(++counter).toString(16).padStart(8, '0')}`

const base = { version: 1, format: '' as const, indent: 0, direction: 'ltr' as const }

const text = (value: string, format = 0) => ({
  type: 'text',
  version: 1,
  text: value,
  format,
  style: '',
  mode: 'normal',
  detail: 0,
})

const inline = (input: string) => {
  const nodes: Record<string, unknown>[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(input))) {
    if (match.index > last) nodes.push(text(input.slice(last, match.index)))
    if (match[1]) {
      nodes.push({
        ...base,
        type: 'link',
        version: 3,
        id: nodeId(),
        fields: { linkType: 'custom', url: match[2], newTab: false },
        children: [text(match[1])],
      })
    } else if (match[3]) {
      nodes.push(text(match[3], 1))
    } else if (match[4]) {
      nodes.push(text(match[4], 2))
    }
    last = pattern.lastIndex
  }
  if (last < input.length) nodes.push(text(input.slice(last)))
  return nodes
}

const block = (item: Block): Record<string, unknown> => {
  if (typeof item === 'string') {
    return { ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: inline(item) }
  }
  if ('h2' in item) return { ...base, type: 'heading', tag: 'h2', children: inline(item.h2) }
  if ('h3' in item) return { ...base, type: 'heading', tag: 'h3', children: inline(item.h3) }
  if ('quote' in item) return { ...base, type: 'quote', children: inline(item.quote) }
  if ('ul' in item) {
    return {
      ...base,
      type: 'list',
      listType: 'bullet',
      tag: 'ul',
      start: 1,
      children: item.ul.map((entry, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(entry) })),
    }
  }
  return { type: 'upload', version: 3, format: '', id: nodeId(), fields: null, relationTo: 'media', value: item.image }
}

export const rich = (...blocks: Block[]) =>
  ({
    root: { ...base, type: 'root', children: blocks.map(block) },
  }) as unknown as {
    root: {
      type: string
      children: { type: string; version: number; [k: string]: unknown }[]
      direction: 'ltr' | 'rtl' | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  }
