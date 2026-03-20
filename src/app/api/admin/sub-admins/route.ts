import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded || decoded.role !== 'main_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await query(
      `SELECT id, username, created_at FROM sub_admins ORDER BY created_at DESC`
    )

    return NextResponse.json({ subAdmins: result.rows })
  } catch (error) {
    console.error('Fetch sub-admins error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sub-admins' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded || decoded.role !== 'main_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username, password } = await req.json()

    const existingResult = await query(
      `SELECT id FROM sub_admins WHERE username = $1`,
      [username]
    )

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO sub_admins (username, password_hash) VALUES ($1, $2) RETURNING *`,
      [username, password]
    )

    return NextResponse.json({ success: true, admin: result.rows[0] })
  } catch (error) {
    console.error('Create sub-admin error:', error)
    return NextResponse.json(
      { error: 'Failed to create sub-admin' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded || decoded.role !== 'main_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    await query(
      `DELETE FROM sub_admins WHERE id = $1`,
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete sub-admin error:', error)
    return NextResponse.json(
      { error: 'Failed to delete sub-admin' },
      { status: 500 }
    )
  }
}
