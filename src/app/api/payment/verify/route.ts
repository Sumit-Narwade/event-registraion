import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, events, userData } = await req.json()

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    const transactionId = `TXN${Date.now()}`

    const registrations = []
    for (const event of events) {
      const registrationId = `REG${Date.now()}${Math.random().toString(36).substr(2, 9)}`
      
      await query(
        `INSERT INTO registrations 
         (registration_id, transaction_id, event_id, event_name, user_name, user_email, user_mobile, college_name, address, amount_paid, payment_id, payment_status, verified, verified_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [registrationId, transactionId, event.id, event.name, userData.name, userData.email, userData.mobile, userData.collegeName, userData.address, event.price, paymentId, 'completed', true, new Date()]
      )

      registrations.push({
        registrationId,
        eventName: event.name,
        eventPrice: event.price,
      })
    }

    const totalAmount = events.reduce((sum: number, e: any) => sum + e.price, 0)

    const transactionResult = await query(
      `INSERT INTO transactions 
       (transaction_id, payment_id, user_name, user_email, user_mobile, total_amount, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [transactionId, paymentId, userData.name, userData.email, userData.mobile, totalAmount, 'completed']
    )

    const regResult = await query(
      `SELECT * FROM registrations WHERE transaction_id = $1`,
      [transactionId]
    )

    return NextResponse.json({
      success: true,
      transactionId,
      registrations,
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
