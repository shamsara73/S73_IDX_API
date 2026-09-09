import type { Context } from '@neabyte/deserve'
import { eq, desc } from 'drizzle-orm'
import Database from '@app/Database.ts'
import * as schemas from '@app/Backend/Schemas/index.ts'
import * as Helpers from '@app/api/Helpers.ts'

export async function GET(ctx: Context): Promise<Response> {
  const rawCode = ctx.param('code')
  if (!rawCode) {
    return Helpers.jsonError('Missing code', 400)
  }
  const code = rawCode.trim().toUpperCase()
  const q = ctx.query() as Record<string, string>
  const { limit, offset, includeTotal } = Helpers.getPagination(q)

  // Primary source: stockSummary (historical & daily OHLCV + Order Book bid/offer)
  const whereClause = eq(schemas.stockSummary.code, code)
  const dataPromise = Database.select()
    .from(schemas.stockSummary)
    .where(whereClause)
    .orderBy(desc(schemas.stockSummary.date))
    .limit(limit)
    .offset(offset)

  const countPromise = includeTotal
    ? Helpers.getTotalCount(Database, schemas.stockSummary, whereClause)
    : undefined

  const { data, total } = await Helpers.runPaginated(dataPromise, countPromise)
  const meta = total !== undefined ? { limit, offset, total } : { limit, offset }
  return ctx.send.json(Helpers.paginatedEnvelope(data, meta))
}
