import type { Context } from '@neabyte/deserve'
import { and, eq, gte, lt } from 'drizzle-orm'
import Database from '@app/Database.ts'
import * as schemas from '@app/Backend/Schemas/index.ts'
import * as Helpers from '@app/api/Helpers.ts'

export async function GET(ctx: Context): Promise<Response> {
  const q = ctx.query() as Record<string, string>
  const dateParam = q['date']
  const codeParam = q['code']?.trim()?.toUpperCase()

  const conditions = []

  if (dateParam) {
    const dateTs = Helpers.parseDate(dateParam)
    if (dateTs !== null) {
      const dayStartMs = dateTs * 1000
      const dayEndMs = (dateTs + 86400) * 1000
      conditions.push(
        gte(schemas.stockSummary.date, dayStartMs),
        lt(schemas.stockSummary.date, dayEndMs)
      )
    }
  }

  if (codeParam) {
    conditions.push(eq(schemas.stockSummary.code, codeParam))
  }

  const { limit, offset, includeTotal } = Helpers.getPagination(q)
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const dataPromise = Database.select()
    .from(schemas.stockSummary)
    .where(whereClause)
    .limit(limit)
    .offset(offset)

  const countPromise = includeTotal
    ? Helpers.getTotalCount(Database, schemas.stockSummary, whereClause)
    : undefined

  const { data, total } = await Helpers.runPaginated(dataPromise, countPromise)
  const meta = total !== undefined ? { limit, offset, total } : { limit, offset }
  return ctx.send.json(Helpers.paginatedEnvelope(data, meta))
}
