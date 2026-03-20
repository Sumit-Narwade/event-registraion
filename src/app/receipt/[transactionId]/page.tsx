import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import { Navbar } from '@/components/Navbar'
import { ReceiptSimple } from '@/components/ReceiptSimple'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ transactionId: string }>
}) {
  const { transactionId } = await params

  let registrations: any[] = []
  let transaction = null

  try {
    const regResult = await query(
      `SELECT * FROM registrations WHERE transaction_id = $1`,
      [transactionId]
    )
    registrations = regResult.rows

    const txnResult = await query(
      `SELECT * FROM transactions WHERE transaction_id = $1`,
      [transactionId]
    )
    transaction = txnResult.rows[0]
  } catch (error) {
    console.error('Failed to fetch receipt data:', error)
  }

  if (!registrations || registrations.length === 0 || !transaction) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-cyan-500/5" />
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative z-10">
        <ReceiptSimple 
          registrations={registrations} 
          transaction={transaction}
        />
      </main>
    </div>
  )
}
