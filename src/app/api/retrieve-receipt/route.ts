import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { searchType, searchValue } = await req.json()

    const column = searchType === 'email' ? 'user_email' : 'user_mobile'

    const result = await query(
      `SELECT * FROM transactions WHERE ${column} = $1 ORDER BY created_at DESC`,
      [searchValue]
    )

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No registrations found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ transactions: result.rows })
  } catch (error) {
    console.error('Retrieve receipt error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve receipt' },
      { status: 500 }
    )
  }
}
