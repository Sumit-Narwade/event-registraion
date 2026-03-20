import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    // Check in admins table first
    let result = await query(
      `SELECT * FROM admins WHERE username = $1 AND password_hash = $2`,
      [username, password]
    )

    let user = result.rows[0]
    let role = ''

    if (user) {
      role = user.is_main_admin ? 'main_admin' : 'admin' // Admins table has roles
    } else {
      // If not in admins, check in sub_admins
      result = await query(
        `SELECT * FROM sub_admins WHERE username = $1 AND password_hash = $2`,
        [username, password]
      )
      user = result.rows[0]
      if (user) {
        role = 'sub_admin'
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      token,
      username: user.username,
      role,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

