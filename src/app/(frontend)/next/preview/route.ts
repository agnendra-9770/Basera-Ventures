import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayload, type PayloadRequest } from 'payload'

/** Opens draft preview for a signed-in editor, then sends them to the page. */
export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config })
  const path = req.nextUrl.searchParams.get('path') ?? '/'
  const safePath = path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\') ? path : '/'

  let user = null
  try {
    ;({ user } = await payload.auth({ req: req as unknown as PayloadRequest, headers: req.headers }))
  } catch (error) {
    payload.logger.error({ err: error }, 'Preview auth failed')
  }
  const draft = await draftMode()
  if (!user) {
    draft.disable()
    return new Response('Sign in to the CMS first, then use the Preview button.', { status: 403 })
  }
  draft.enable()
  redirect(safePath)
}
