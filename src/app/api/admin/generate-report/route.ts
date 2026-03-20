import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
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

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded || decoded.role !== 'main_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await req.json()

    let registrations = []
    let title = ''

    if (eventId === 'all') {
      const regsResult = await query(
        `SELECT r.*, e.name as event_name 
         FROM registrations r 
         JOIN events e ON r.event_id = e.id 
         ORDER BY r.created_at DESC`
      )
      registrations = regsResult.rows
      title = 'All Candidates Report'
    } else {
      const eventResult = await query(
        `SELECT name FROM events WHERE id = $1`,
        [eventId]
      )
      const event = eventResult.rows[0]

      if (!event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      const regsResult = await query(
        `SELECT * FROM registrations WHERE event_id = $1 ORDER BY created_at DESC`,
        [eventId]
      )
      registrations = regsResult.rows
      title = `Event: ${event.name}`
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json(
        { error: 'No registrations found' },
        { status: 404 }
      )
    }

    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('TECH FEST 2025 - Registration Report', 14, 20)

    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text(title, 14, 30)
    
    doc.setFontSize(10)
    doc.text(`Total Registrations: ${registrations.length}`, 14, 38)
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 44)

    const tableData = registrations.map((reg: any, index: number) => [
      index + 1,
      reg.registration_id,
      reg.user_name,
      reg.user_email,
      reg.user_mobile,
      reg.college_name,
      `₹${reg.amount_paid}`,
      new Date(reg.created_at).toLocaleDateString('en-IN'),
    ])

    autoTable(doc, {
      startY: 52,
      head: [['#', 'ID', 'Name', 'Email', 'Mobile', 'College', 'Amount', 'Date']],
      body: tableData,
      headStyles: {
        fillColor: [6, 182, 212],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [240, 253, 255],
      },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
        4: { cellWidth: 22 },
        5: { cellWidth: 30 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        doc.setFontSize(8)
        doc.setTextColor(128)
        const pageCount = doc.getNumberOfPages()
        const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber
        doc.text(
          `Page ${currentPage} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        )
      },
    })

    const totalAmount = registrations.reduce((sum: number, reg: any) => sum + parseFloat(reg.amount_paid), 0)
    const finalY = (doc as any).lastAutoTable.finalY + 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Revenue: ₹${totalAmount}`, 14, finalY)

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="techfest-report-${eventId}-${Date.now()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
