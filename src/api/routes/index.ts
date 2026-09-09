import type { Context } from '@neabyte/deserve'

export function GET(_ctx: Context): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: '/docs' }
  })
}
