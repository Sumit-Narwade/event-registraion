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
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const transactionId = searchParams.get('transaction')
    const email = searchParams.get('email')
    const mobile = searchParams.get('mobile')
    const registrationId = searchParams.get('registration')

    let result
    if (registrationId) {
      result = await query(
        `SELECT r.*, e.venue as event_venue, e.event_date 
         FROM registrations r 
         JOIN events e ON r.event_id = e.id 
         WHERE r.registration_id = $1`,
        [registrationId]
      )
    } else if (transactionId) {
      result = await query(
        `SELECT r.*, e.venue as event_venue, e.event_date 
         FROM registrations r 
         JOIN events e ON r.event_id = e.id 
         WHERE r.transaction_id = $1`,
        [transactionId]
      )
    } else if (email) {
      result = await query(
        `SELECT r.*, e.venue as event_venue, e.event_date 
         FROM registrations r 
         JOIN events e ON r.event_id = e.id 
         WHERE r.user_email = $1`,
        [email]
      )
    } else if (mobile) {
      result = await query(
        `SELECT r.*, e.venue as event_venue, e.event_date 
         FROM registrations r 
         JOIN events e ON r.event_id = e.id 
         WHERE r.user_mobile = $1`,
        [mobile]
      )
    } else {
      return NextResponse.json({ error: 'Search parameter required' }, { status: 400 })
    }

    const registration = result.rows[0]

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Map column names to match frontend interface
    const formattedRegistration = {
      id: registration.id,
      registration_id: registration.registration_id,
      transaction_id: registration.transaction_id,
      full_name: registration.user_name,
      email: registration.user_email,
      mobile: registration.user_mobile,
      event_name: registration.event_name,
      event_venue: registration.event_venue,
      event_date: registration.event_date,
      total_amount: registration.amount_paid,
      payment_status: registration.payment_status,
      created_at: registration.created_at,
    }

    return NextResponse.json({ registration: formattedRegistration })
  } catch (error) {
    console.error('Verify registration error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { registrationId } = await req.json()

    const result = await query(
      `SELECT r.*, e.venue as event_venue, e.event_date 
       FROM registrations r 
       JOIN events e ON r.event_id = e.id 
       WHERE r.registration_id = $1`,
      [registrationId]
    )

    const registration = result.rows[0]

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    const formattedRegistration = {
      id: registration.id,
      registration_id: registration.registration_id,
      transaction_id: registration.transaction_id,
      full_name: registration.user_name,
      email: registration.user_email,
      mobile: registration.user_mobile,
      event_name: registration.event_name,
      event_venue: registration.event_venue,
      event_date: registration.event_date,
      total_amount: registration.amount_paid,
      payment_status: registration.payment_status,
      created_at: registration.created_at,
    }

    return NextResponse.json({ registration: formattedRegistration })
  } catch (error) {
    console.error('Verify registration error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
