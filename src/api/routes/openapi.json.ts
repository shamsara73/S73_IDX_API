import type { Context } from '@neabyte/deserve'

export const OPENAPI_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'IDX Screener & Quantitative API',
    version: '1.0.0',
    description: 'Direct Indonesian Stock Exchange (IDX) open market intelligence, fundamental ratios, trading summaries, and quantitative factor dataset API for research & automated systems.',
    contact: {
      name: 'shamsara73',
      url: 'https://idx.shamsara.my.id'
    }
  },
  servers: [
    {
      url: 'https://idx-be.shamsara.my.id',
      description: 'Production Cloudflare Tunnel Gateway'
    },
    {
      url: 'http://127.0.0.1:52060',
      description: 'Local Direct Host'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Service Health Check',
        tags: ['System'],
        responses: {
          '200': {
            description: 'API is healthy',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } }
          }
        }
      }
    },
    '/companies': {
      get: {
        summary: 'List Listed Companies',
        description: 'Get list of all listed issuers on the Indonesia Stock Exchange.',
        tags: ['Companies'],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 }, description: 'Limit number of results' },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 }, description: 'Pagination offset' },
          { name: 'sector', in: 'query', schema: { type: 'string' }, description: 'Filter by sector name' }
        ],
        responses: {
          '200': { description: 'Companies list returned' }
        }
      }
    },
    '/companies/{code}': {
      get: {
        summary: 'Company Profile Details',
        tags: ['Companies'],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string', example: 'BBRI' }, description: '4-letter IDX Stock ticker' }
        ],
        responses: {
          '200': { description: 'Company profile and basic info' }
        }
      }
    },
    '/stock-screener': {
      get: {
        summary: 'Market Screener Snapshot',
        description: 'Comprehensive screener snapshot covering valuation ratios (PER, PBV, DER, ROE, NPM) and multi-period price changes.',
        tags: ['Screener & Fundamentals'],
        responses: {
          '200': { description: 'All stock fundamentals & screener metrics' }
        }
      }
    },
    '/trading/stock-summary': {
      get: {
        summary: 'Daily Stock Trading Summary',
        description: 'Historical and daily EOD trading summary (Open, High, Low, Close, Volume, Value, Frequency, Foreign Buy/Sell).',
        tags: ['Trading & Market Data'],
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'integer', example: 20260908 }, description: 'Date in YYYYMMDD format' },
          { name: 'code', in: 'query', schema: { type: 'string', example: 'TLKM' }, description: 'Filter by stock ticker' }
        ],
        responses: {
          '200': { description: 'Daily summary records' }
        }
      }
    },
    '/trading/company/{code}/daily': {
      get: {
        summary: 'Historical OHLCV for Stock',
        tags: ['Trading & Market Data'],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string', example: 'BBCA' } }
        ],
        responses: {
          '200': { description: 'Historical daily OHLCV series' }
        }
      }
    },
    '/trading/company/{code}/summary': {
      get: {
        summary: 'Latest Company Trading Summary',
        tags: ['Trading & Market Data'],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string', example: 'ASII' } }
        ],
        responses: {
          '200': { description: 'Latest trading summary' }
        }
      }
    },
    '/trading/foreign': {
      get: {
        summary: 'Foreign Trading Flow Statistics',
        description: 'Aggregated foreign investor net buy/sell flow data.',
        tags: ['Trading & Market Data'],
        responses: {
          '200': { description: 'Foreign flow stats' }
        }
      }
    },
    '/trading/domestic': {
      get: {
        summary: 'Domestic Trading Statistics',
        tags: ['Trading & Market Data'],
        responses: {
          '200': { description: 'Domestic investor activity' }
        }
      }
    },
    '/trading/top-gainer': {
      get: {
        summary: 'Top Gainers',
        tags: ['Trading & Market Data'],
        responses: {
          '200': { description: 'Top gaining stocks' }
        }
      }
    },
    '/trading/top-loser': {
      get: {
        summary: 'Top Losers',
        tags: ['Trading & Market Data'],
        responses: {
          '200': { description: 'Top losing stocks' }
        }
      }
    },
    '/trading/broker-summary': {
      get: {
        summary: 'Broker Summary & Activity',
        tags: ['Market Participants'],
        responses: {
          '200': { description: 'Broker volume & value statistics' }
        }
      }
    },
    '/market/indices': {
      get: {
        summary: 'Market Indices List',
        description: 'List of all IDX indices (IHSG, LQ45, IDX30, Sectoral indices).',
        tags: ['Indices & Macro'],
        responses: {
          '200': { description: 'Index list' }
        }
      }
    },
    '/market/daily-index': {
      get: {
        summary: 'Daily Index Points',
        tags: ['Indices & Macro'],
        responses: {
          '200': { description: 'Daily index closing points' }
        }
      }
    },
    '/market/sectoral-movement': {
      get: {
        summary: 'Sectoral Performance & Movement',
        tags: ['Indices & Macro'],
        responses: {
          '200': { description: 'Sectoral index performance' }
        }
      }
    },
    '/suspend': {
      get: {
        summary: 'Suspension & UMA Notices',
        tags: ['Regulatory & Surveillance'],
        responses: {
          '200': { description: 'List of currently suspended stocks and Unusual Market Activity (UMA) notices' }
        }
      }
    },
    '/relisting': {
      get: {
        summary: 'Relisted Stocks',
        tags: ['Regulatory & Surveillance'],
        responses: {
          '200': { description: 'Relisting history' }
        }
      }
    }
  }
}

export function GET(ctx: Context) {
  return ctx.send.json(OPENAPI_SPEC)
}
