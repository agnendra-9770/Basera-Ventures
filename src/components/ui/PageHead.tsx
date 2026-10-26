import type { ReactNode } from 'react'

import { asMedia } from '@/lib/media'
import { Tx } from '@/lib/text'

import { Frame, type Ratio } from '../media/Img'
import { Breadcrumbs } from './Primitives'

/** The opening of every inner page: breadcrumbs, eyebrow, title, intro and an optional photograph. */
export function PageHead({
  trail,
  eyebrow,
  heading,
  intro,
  image,
  imageRatio = '21x9',
  children,
}: {
  trail: { name: string; path: string }[]
  eyebrow?: string | null
  heading: string
  intro?: string | null
  image?: unknown
  imageRatio?: Ratio
  children?: ReactNode
}) {
  const photo = asMedia(image)
  return (
    <>
      <header className="container page-head">
        <Breadcrumbs trail={trail} />
        <div className="page-head__grid">
          <div className="page-head__title">
            {eyebrow && (
              <p className="eyebrow">
                <Tx>{eyebrow}</Tx>
              </p>
            )}
            <h1 className="display-l">
              <Tx>{heading}</Tx>
            </h1>
          </div>
          {(intro || children) && (
            <div className="page-head__intro">
              {intro && (
                <p className="lead text-soft">
                  <Tx>{intro}</Tx>
                </p>
              )}
              {children}
            </div>
          )}
        </div>
      </header>
      {photo && (
        <div className="container page-head__image">
          <Frame media={photo} ratio={imageRatio} sizes="(min-width: 1480px) 1480px, 100vw" preload reveal={false} />
        </div>
      )}
    </>
  )
}
