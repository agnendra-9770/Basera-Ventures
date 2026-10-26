import type { PostgresAdapter } from '@payloadcms/db-postgres'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { getStorageFilePath } from '@payloadcms/plugin-cloud-storage/utilities'
import { readFile } from 'node:fs/promises'
import type { PayloadRequest } from 'payload'

/**
 * Keeps uploaded files in the Postgres database (table `media_files`) instead of on disk,
 * so hosts without a persistent disk — Vercel — can serve and accept uploads with no
 * extra storage account. Files are small (photos are resized on upload) and the site
 * reaches them through the image optimiser, which caches every size it makes.
 */
export const databaseStorage =
  (): Adapter =>
  ({ collection, prefix }) => {
    const pool = (req: PayloadRequest) => (req.payload.db as unknown as PostgresAdapter).pool

    return {
      name: 'database',
      handleUpload: async ({ file, req, storageFilePath }) => {
        const data = file.buffer?.length ? file.buffer : file.tempFilePath ? await readFile(file.tempFilePath) : file.buffer
        await pool(req).query(
          `insert into media_files (key, mime_type, size, data) values ($1, $2, $3, $4)
           on conflict (key) do update set mime_type = excluded.mime_type, size = excluded.size, data = excluded.data, updated_at = now()`,
          [storageFilePath, file.mimeType, data.length, data],
        )
      },
      handleDelete: async ({ req, storageFilePath }) => {
        await pool(req).query('delete from media_files where key = $1', [storageFilePath])
      },
      staticHandler: async (req, { doc, params }) => {
        const key = await getStorageFilePath({
          clientUploadContext: params.clientUploadContext,
          collection,
          collectionPrefix: prefix,
          doc,
          filename: params.filename,
          prefixQueryParam: params.prefix,
          req,
        })
        const { rows } = await pool(req).query<{ data: Buffer; mime_type: string; size: number; updated_at: Date }>(
          'select data, mime_type, size, updated_at from media_files where key = $1',
          [key],
        )
        const file = rows[0]
        if (!file) return new Response(null, { status: 404 })
        const etag = `"${file.size}-${new Date(file.updated_at).getTime()}"`
        const headers = {
          'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
          'Content-Type': file.mime_type,
          ETag: etag,
        }
        if (req.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers })
        return new Response(new Uint8Array(file.data), { headers: { ...headers, 'Content-Length': String(file.size) } })
      },
    }
  }
