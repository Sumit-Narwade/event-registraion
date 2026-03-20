import { Pool, PoolConfig } from 'pg'
import { parse } from 'pg-connection-string'

// Handle self-signed certificate issues in strict environments
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const connectionString = process.env.DATABASE_URL || ''

const isLocalhost = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1')

// Parse the connection string to a config object
const config: PoolConfig = parse(connectionString)

// Add SSL configuration for non-localhost connections
if (!isLocalhost) {
  config.ssl = {
    rejectUnauthorized: false,
  }
} else {
  // For localhost, ensure password is a string
  config.password = config.password || ''
}

const pool = new Pool({
  ...config,
  max: 20, // Increased for better local speed
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Reduced for faster failure detection
})

export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params)
    return result
  } catch (error: any) {
    console.error('Database Query Error:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
    })
    throw error
  }
}

export const getClient = async () => {
  return await pool.connect()
}

export default pool
