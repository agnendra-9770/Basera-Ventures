/**
 * The drawn Basera logo (src/components/brand, built by brand/source/build_logo.py)
 * exists for these two spellings of the name. Any other brand name is set in type.
 */
export type LogoSpelling = 'ventures' | 'venture'

export const logoSpelling = (brand: string): LogoSpelling | null => {
  const name = brand.replace(/\*/g, '').trim().replace(/\s+/g, ' ').toLowerCase()
  if (name === 'basera ventures') return 'ventures'
  if (name === 'basera venture') return 'venture'
  return null
}

/** The square symbol, for schema.org `logo`. */
export const LOGO_ICON = '/brand/icons/symbol-512.png'
