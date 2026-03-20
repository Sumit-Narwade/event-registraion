'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, Home, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

interface Registration {
  registration_id: string
  event_name: string
  user_name: string
  user_email: string
  user_mobile: string
  college_name: string
  address: string
  amount_paid: number
  payment_id: string
  payment_status: string
  verified: boolean
  verified_at: string
  created_at: string
}

interface Transaction {
  transaction_id: string
  payment_id: string
  user_name: string
  user_email: string
  user_mobile: string
  total_amount: number
  payment_status: string
  created_at: string
}

export function ReceiptSimple({
  registrations,
  transaction,
}: {
  registrations: Registration[]
  transaction: Transaction
}) {
  const router = useRouter()
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (typeof window === 'undefined' || isDownloading) return

    setIsDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = receiptRef.current
      if (!element) throw new Error('Receipt element not found')

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `techfest-receipt-${transaction.transaction_id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      await html2pdf().from(element).set(opt).save()
    } catch (error: any) {
      console.error('Download failed detailed error:', error)
      alert(`Failed to generate PDF. Your browser's print dialog will be opened as a fallback.`)
      window.print()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: '#333' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <CheckCircle2 style={{ width: '80px', height: '80px', color: '#22c55e', margin: '0 auto' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>Payment Successful</h1>
        <p style={{ color: '#666' }}>Your registration for TECH FEST 2025 is confirmed.</p>
      </div>

      <div ref={receiptRef} style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
          Registration Receipt
        </h2>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Transaction Details</h3>
          <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
          <p><strong>Payment ID:</strong> {transaction.payment_id}</p>
          <p><strong>Total Amount:</strong> ₹{transaction.total_amount}</p>
          <p><strong>Payment Status:</strong> {transaction.payment_status}</p>
          <p><strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
        </div>

        {registrations.map((reg, index) => (
          <div key={reg.registration_id} style={{ marginBottom: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
            <h3>Registration #{index + 1}</h3>
            <p><strong>Registration ID:</strong> {reg.registration_id}</p>
            <p><strong>Event Name:</strong> {reg.event_name}</p>
            <p><strong>Amount Paid:</strong> ₹{reg.amount_paid}</p>
            <hr style={{ margin: '1rem 0' }} />
            <p><strong>Name:</strong> {reg.user_name}</p>
            <p><strong>Email:</strong> {reg.user_email}</p>
            <p><strong>Mobile:</strong> {reg.user_mobile}</p>
            <p><strong>College:</strong> {reg.college_name}</p>
            <p><strong>Address:</strong> {reg.address}</p>
            <hr style={{ margin: '1rem 0' }} />
            <p><strong>Payment ID:</strong> {reg.payment_id}</p>
            <p><strong>Payment Status:</strong> {reg.payment_status}</p>
            <p><strong>Verified:</strong> {reg.verified ? 'Yes' : 'No'}</p>
            {reg.verified && <p><strong>Verified At:</strong> {new Date(reg.verified_at).toLocaleString()}</p>}
            <p><strong>Registration Date:</strong> {new Date(reg.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download PDF
        </Button>
        <Button variant="outline" onClick={() => router.push('/')} style={{ marginLeft: '1rem' }}>
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
