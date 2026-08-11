// One-shot snapshot sync for IDX-API (run: deno run -A sync_now.ts)
// NOTE: dbInitialize does NOT exist in @app/Backend/Sync (USAGE.md doc artifact).
// Schema is applied via `deno task db:push` — DB already initialized & mounted.
import * as sync from '@app/Backend/Sync/index.ts'

console.log('[sync] company profile...')
await sync.syncCompanyProfile()

console.log('[sync] index list...')
await sync.syncIndexList()

console.log('[sync] trade summary...')
await sync.syncTradeSummary()

const Y = 2026
const M = 8
console.log(`[sync] sectoral movement (${Y}-${M})...`)
await sync.syncSectoralMovement(Y, M)
console.log(`[sync] top gainers (${Y}-${M})...`)
await sync.syncTopGainer(Y, M)
console.log(`[sync] top losers (${Y}-${M})...`)
await sync.syncTopLoser(Y, M)
console.log(`[sync] foreign trading (${Y}-${M})...`)
await sync.syncForeignTrading(Y, M)

console.log('[sync] stock summary 20260811...')
try {
  await sync.syncStockSummary('20260811')
} catch (e) {
  console.log('[sync] summary skipped:', String((e as Error)?.message ?? e).slice(0, 120))
}

console.log('[sync] DONE')
