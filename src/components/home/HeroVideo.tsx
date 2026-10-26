'use client'

import { useEffect, useRef, useState } from 'react'

import { cx } from '@/lib/cx'

import { Icon } from '../ui/Icon'

/**
 * Muted background film for the hero. It never plays for visitors who prefer
 * reduced motion or have data-saver on, and it always has a pause button.
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [allowed, setAllowed] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    setAllowed(!reduce && !saveData)
  }, [])

  useEffect(() => {
    if (!allowed) return
    ref.current?.play().catch(() => setPlaying(false))
  }, [allowed])

  if (!allowed) return null

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <>
      <video
        ref={ref}
        className={cx('hero__video', playing && 'is-playing')}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="hero__video-toggle" onClick={toggle}>
        <Icon name={playing ? 'pause' : 'play'} size={16} />
        <span className="sr-only">{playing ? 'Pause the background film' : 'Play the background film'}</span>
      </button>
    </>
  )
}
