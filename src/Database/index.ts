import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schemas from '@app/Backend/Schemas/index.js'

/**
 * Database access instance.
 * @description Exports the Drizzle ORM instance for database operations with NeonDB.
 */
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema: schemas })
export default db
