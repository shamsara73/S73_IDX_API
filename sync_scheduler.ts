/**
 * IDX-API scheduled sync jobs (run: deno run -A --unstable-cron sync_scheduler.ts)
 * Schedules the official-IDX data syncs at sensible cadences.
 * Times in UTC (server); IDX market closes 16:00 WIB = 09:00 UTC.
 *  - Daily 10:05 UTC (17:05 WIB) Mon-Fri: EOD summaries, sectoral, top/flows, indices
 *  - Weekly Mon 11:00 UTC (18:00 WIB): company profiles + index list
 * NOTE: monthly-stat endpoints (top gainer/loser, foreign trading) return empty
 * until IDX publishes the month's data — harmless to run early, fills when ready.
 */
import * as sync from '@app/Backend/Sync/index.ts'
import Logger from '@app/Logger.ts'

function todayDateInt(): number {
  const n = new Date()
  return n.getFullYear() * 10000 + (n.getMonth() + 1) * 100 + n.getDate()
}

async function dailySync(): Promise<void> {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const today = todayDateInt()
  Logger.info('[scheduler] daily sync start')
  const steps: [string, () => Promise<unknown>][] = [
    ['stockSummary', () => sync.syncStockSummary(String(today))],
    ['tradeSummary', () => sync.syncTradeSummary()],
    ['sectoralMovement', () => sync.syncSectoralMovement(y, m)],
    ['topGainer', () => sync.syncTopGainer(y, m)],
    ['topLoser', () => sync.syncTopLoser(y, m)],
    ['foreignTrading', () => sync.syncForeignTrading(y, m)],
    ['dailyIndex', () => sync.syncDailyIndex(y, m)],
    ['indexSummary', () => sync.syncIndexSummary(String(today))]
  ]
  for (const [name, fn] of steps) {
    try {
      await fn()
    } catch (error) {
      Logger.warn(`[scheduler] ${name} failed: ${String(error).slice(0, 200)}`)
    }
  }
  Logger.info('[scheduler] daily sync done')
}

async function weeklySync(): Promise<void> {
  Logger.info('[scheduler] weekly sync start')
  const steps: [string, () => Promise<unknown>][] = [
    ['companyProfile', () => sync.syncCompanyProfile()],
    ['indexList', () => sync.syncIndexList()]
  ]
  for (const [name, fn] of steps) {
    try {
      await fn()
    } catch (error) {
      Logger.warn(`[scheduler] ${name} failed: ${String(error).slice(0, 200)}`)
    }
  }
  Logger.info('[scheduler] weekly sync done')
}

Deno.cron('idx-api daily sync', '5 10 * * 1-5', dailySync)
Deno.cron('idx-api weekly sync', '0 11 * * 1', weeklySync)

Logger.info('[scheduler] jobs registered: daily Mon-Fri 10:05 UTC, weekly Mon 11:00 UTC')
