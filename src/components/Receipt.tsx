'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Download, Home, Cpu, Zap, Terminal, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { jsPDF } from 'jspdf'

interface Registration {
  registration_id: string
  event_name: string
  user_name: string
  user_email: string
  user_mobile: string
  college_name: string
  address: string
  amount_paid: number
  created_at: string
}

interface Transaction {
  transaction_id: string
  payment_id: string
  total_amount: number
  created_at: string
}

export function Receipt({ 
  registrations, 
  transaction 
}: { 
  registrations: Registration[]
  transaction: Transaction
}) {
  const router = useRouter()
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

    const handleDownload = async () => {
      if (typeof window === 'undefined' || isDownloading) return
      
      setIsDownloading(true)
      try {
        console.log('Starting PDF generation...')
        const html2pdf = (await import('html2pdf.js')).default
        const element = receiptRef.current
        if (!element) throw new Error('Receipt element not found')

        // Clone the element to modify it for PDF if necessary
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `techfest-receipt-${transaction.transaction_id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            backgroundColor: '#0a0118',
            logging: true 
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        console.log('Calling html2pdf...')
        await html2pdf().from(element).set(opt).save()
        console.log('PDF saved successfully')
        
        setDownloaded(true)
        setTimeout(() => setDownloaded(false), 5000)
      } catch (error: any) {
        console.error('Download failed detailed error:', error)
        const proceed = confirm(`Failed to generate PDF: ${error?.message || 'Unknown error'}. Would you like to use the browser print dialog instead?`)
        if (proceed) {
          window.print()
        }
      } finally {
        setIsDownloading(false)
      }
    }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-full mb-6 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-pulse">
          <CheckCircle2 className="w-14 h-14 text-cyan-400" />
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-3 font-mono tracking-tight">
          &gt; PAYMENT_SUCCESS
        </h1>
        <p className="text-cyan-300/70 font-mono text-lg">{"// Registration confirmed. Welcome to TECH FEST 2025_"}</p>
      </div>

      <div ref={receiptRef} className="space-y-6 bg-[#0a0118] p-6 rounded-2xl">
        {registrations.map((registration, index) => (
          <Card key={registration.registration_id} className="border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden bg-gradient-to-br from-slate-900/95 to-purple-900/70 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl" />
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/30 rounded-xl border border-cyan-400/30">
                    <Cpu className="w-8 h-8 text-cyan-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1 font-mono tracking-wider flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      TECH_FEST_2025
                    </h2>
                    <p className="text-cyan-100 font-mono text-sm">Event Registration Receipt</p>
                  </div>
                </div>
                <div className="text-right bg-black/30 px-4 py-2 rounded-lg border border-cyan-400/30">
                  <div className="text-xs text-cyan-200 font-mono">REG_ID</div>
                  <div className="font-mono font-bold text-lg text-cyan-100">{registration.registration_id}</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-5 shadow-[inset_0_0_30px_rgba(6,182,212,0.1)]">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-cyan-400" />
                  <span className="text-cyan-400/60 font-mono text-sm">EVENT_NAME</span>
                </div>
                <h3 className="font-black text-2xl text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text font-mono mb-3">{registration.event_name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-mono">₹{registration.amount_paid}</span>
                  <span className="text-cyan-400/50 font-mono">INR</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                  <div className="text-xs text-cyan-400/60 mb-1 font-mono uppercase tracking-wider">Participant</div>
                  <div className="font-bold text-cyan-100 text-lg font-mono">{registration.user_name}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                  <div className="text-xs text-cyan-400/60 mb-1 font-mono uppercase tracking-wider">Email</div>
                  <div className="font-mono text-sm text-cyan-200 break-all">{registration.user_email}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                  <div className="text-xs text-cyan-400/60 mb-1 font-mono uppercase tracking-wider">Mobile</div>
                  <div className="font-mono text-cyan-200">{registration.user_mobile}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                  <div className="text-xs text-cyan-400/60 mb-1 font-mono uppercase tracking-wider">College/Institution</div>
                  <div className="font-bold text-cyan-100 font-mono">{registration.college_name}</div>
                </div>
                <div className="md:col-span-2 bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                  <div className="text-xs text-cyan-400/60 mb-1 font-mono uppercase tracking-wider">Address</div>
                  <div className="text-cyan-200">{registration.address}</div>
                </div>
              </div>

              <div className="border-t border-cyan-500/20 pt-4 grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/30 p-3 rounded-lg border border-purple-500/20">
                  <div className="text-xs text-purple-400/60 font-mono uppercase tracking-wider">Transaction ID</div>
                  <div className="font-mono font-bold text-purple-300 text-sm">{transaction.transaction_id}</div>
                </div>
                <div className="bg-slate-800/30 p-3 rounded-lg border border-purple-500/20">
                  <div className="text-xs text-purple-400/60 font-mono uppercase tracking-wider">Payment ID</div>
                  <div className="font-mono text-purple-300 text-sm">{transaction.payment_id}</div>
                </div>
                <div className="bg-slate-800/30 p-3 rounded-lg border border-cyan-500/20">
                  <div className="text-xs text-cyan-400/60 font-mono uppercase tracking-wider">Registration Date</div>
                  <div className="font-bold text-cyan-200 font-mono">
                    {new Date(registration.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="bg-slate-800/30 p-3 rounded-lg border border-green-500/20">
                  <div className="text-xs text-green-400/60 font-mono uppercase tracking-wider">Status</div>
                  <div className="inline-flex items-center gap-2 text-green-400 font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {registrations.length > 1 && (
          <Card className="border-2 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] bg-gradient-to-br from-slate-900/95 to-purple-900/70 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-purple-400/60 mb-1 font-mono text-sm uppercase tracking-wider">Total Amount Paid</div>
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-mono">₹{transaction.total_amount}</div>
                </div>
                <div className="text-right">
                  <div className="text-purple-400/60 mb-1 font-mono text-sm uppercase tracking-wider">Total Events</div>
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-mono">{registrations.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 mt-10">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            size="lg"
            className={`min-w-[320px] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 text-black font-black text-xl px-10 h-16 shadow-[0_0_50px_rgba(34,197,94,0.5)] hover:shadow-[0_0_80px_rgba(34,197,94,0.7)] transition-all border-2 border-green-400/60 group relative overflow-hidden rounded-xl ${isDownloading ? 'opacity-80 cursor-wait' : ''}`}
          >
            <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            {isDownloading ? (
              <>
                <Loader2 className="w-7 h-7 mr-3 animate-spin" />
                GENERATING PDF...
              </>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="w-7 h-7 mr-3" />
                DOWNLOADED!
              </>
            ) : (
              <>
                <Download className="w-7 h-7 mr-3 group-hover:animate-bounce" />
                DOWNLOAD RECEIPT (PDF)
              </>
            )}
          </Button>
          {downloaded && (
            <p className="text-green-400 font-mono text-sm animate-pulse">
              &gt; Receipt saved to your downloads folder_
            </p>
          )}
          <Button
            onClick={() => router.push('/')}
            size="lg"
            variant="outline"
            className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 font-bold text-lg px-8 h-12 transition-all font-mono backdrop-blur-sm"
          >
            <Home className="w-5 h-5 mr-2" />
            BACK TO HOME
          </Button>
        </div>
    </div>
  )
}
