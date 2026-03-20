import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const result = await query(
      `SELECT id, name FROM events ORDER BY name ASC`
    )

    return NextResponse.json({ events: result.rows })
  } catch (error) {
    console.error('Fetch events error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
