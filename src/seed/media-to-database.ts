/**
 * Copies photographs already on this computer's disk (media/) into the database, for media
 * created before files were stored there. Safe to run again: it skips files already stored.
 *
 *   npm run media:upload
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

import config from '../payload.config'

const run = async () => {
  const payload = await getPayload({ config })
  if (payload.db.name !== 'postgres') {
    payload.logger.info('Not using Postgres — files are served from media/ already.')
    return
  }
  const pool = (payload.db as unknown as PostgresAdapter).pool
  const dir = path.resolve(process.cwd(), 'media')
  const { docs } = await payload.find({ collection: 'media', depth: 0, limit: 0, pagination: false })
  let copied = 0
  const missing: string[] = []

  for (const doc of docs) {
    const files = [
      { filename: doc.filename, mimeType: doc.mimeType },
      ...Object.values(doc.sizes ?? {}).map((size) => ({ filename: size?.filename, mimeType: size?.mimeType })),
    ].filter((file): file is { filename: string; mimeType: string } => Boolean(file.filename && file.mimeType))

    for (const file of files) {
      const { rowCount } = await pool.query('select 1 from media_files where key = $1', [file.filename])
      if (rowCount) continue
      const data = await readFile(path.join(dir, file.filename)).catch(() => null)
      if (!data) {
        missing.push(file.filename)
        continue
      }
      await pool.query('insert into media_files (key, mime_type, size, data) values ($1, $2, $3, $4) on conflict (key) do nothing', [
        file.filename,
        file.mimeType,
        data.length,
        data,
      ])
      copied += 1
    }
  }

  payload.logger.info(`Copied ${copied} file(s) into the database.`)
  if (missing.length) payload.logger.warn(`Not found in media/ (upload these again in the CMS): ${missing.join(', ')}`)
}

await run()
process.exit(0)
