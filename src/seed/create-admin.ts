/**
 * Creates your admin login, or sets a new password for an existing one — run on your own computer:
 *
 *   npm run admin:create
 *
 * The website itself never lets visitors sign up. Without a prompt (e.g. in CI), set
 * ADMIN_EMAIL and ADMIN_PASSWORD (and optionally ADMIN_NAME) instead.
 */
import { createInterface } from 'node:readline'
import { Writable } from 'node:stream'

import { getPayload } from 'payload'

import config from '../payload.config'

const ask = (question: string, hidden = false) =>
  new Promise<string>((resolve) => {
    let muted = false
    const output = new Writable({
      write(chunk, _encoding, done) {
        if (!muted) process.stdout.write(chunk)
        done()
      },
    })
    const rl = createInterface({ input: process.stdin, output, terminal: true })
    rl.question(question, (answer) => {
      rl.close()
      if (hidden) process.stdout.write('\n')
      resolve(answer.trim())
    })
    muted = hidden
  })

const run = async () => {
  const email = (process.env.ADMIN_EMAIL || (await ask('Email for your admin login: '))).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('That doesn’t look like an email address.')
  const name = process.env.ADMIN_NAME ?? (await ask('Your name (optional): '))
  const password = process.env.ADMIN_PASSWORD || (await ask('Password (at least 10 characters, hidden): ', true))
  if (password.length < 10) throw new Error('Use a password of at least 10 characters.')
  if (!process.env.ADMIN_PASSWORD && (await ask('Type it again: ', true)) !== password) throw new Error('The passwords didn’t match.')

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: { password, ...(name ? { name } : {}), loginAttempts: 0, lockUntil: null },
    })
    payload.logger.info(`Password updated for ${email}. Sign in at /admin.`)
  } else {
    await payload.create({ collection: 'users', data: { email, password, ...(name ? { name } : {}) } })
    payload.logger.info(`Admin login created for ${email}. Sign in at /admin.`)
  }
}

try {
  await run()
  process.exit(0)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
