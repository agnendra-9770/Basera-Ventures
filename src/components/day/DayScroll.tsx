'use client'

import { useEffect } from 'react'

/** Shifts the page's colour with the time of day as each moment scrolls into view. */
export function DayScroll() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.day-page')
    const moments = Array.from(document.querySelectorAll<HTMLElement>('[data-moment-time]'))
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.day-timeline a'))
    if (!page || !moments.length || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const el = visible.target as HTMLElement
        page.dataset.time = el.dataset.momentTime
        links.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${el.id}`))
      },
      { threshold: [0.35, 0.6], rootMargin: '-15% 0px -15% 0px' },
    )
    moments.forEach((m) => io.observe(m))

    // Back at the top of the page, return to the first moment's light.
    const head = document.querySelector<HTMLElement>('.page-head')
    const top = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        page.dataset.time = moments[0].dataset.momentTime
        links.forEach((link, i) => link.classList.toggle('is-current', i === 0))
      }
    })
    if (head) top.observe(head)

    return () => {
      io.disconnect()
      top.disconnect()
    }
  }, [])

  return null
}
