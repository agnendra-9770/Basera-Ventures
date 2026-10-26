/**
 * The site's public address. NEXT_PUBLIC_SERVER_URL wins; on Vercel, when it is missing or
 * still the localhost value from a local .env, the production domain Vercel provides is used.
 */
export const serverUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel && (!configured || /\/\/(localhost|127\.0\.0\.1)\b/.test(configured))) return `https://${vercel}`
  return (configured || 'http://localhost:3000').replace(/\/$/, '')
}

/** Link used by the "Preview" button in the CMS. Only signed-in editors can open drafts. */
export const previewPath = (path: string) =>
  `${serverUrl()}/next/preview?path=${encodeURIComponent(path)}`
