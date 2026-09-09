import type { Context } from '@neabyte/deserve'
import { OPENAPI_SPEC } from '@app/api/routes/openapi.json.ts'

export function GET(_ctx: Context): Response {
  return Response.json(OPENAPI_SPEC, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
