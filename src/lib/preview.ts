export const serverUrl = () => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Link used by the "Preview" button in the CMS. Only signed-in editors can open drafts. */
export const previewPath = (path: string) =>
  `${serverUrl()}/next/preview?path=${encodeURIComponent(path)}`
