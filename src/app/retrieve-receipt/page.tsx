'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

export default function RetrieveReceiptPage() {
  const [searchType, setSearchType] = useState<'email' | 'mobile'>('email')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchValue.trim()) {
      toast.error('Please enter your email or mobile number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/retrieve-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchType,
          searchValue,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'No registrations found')
        return
      }

      if (data.transactions && data.transactions.length > 0) {
        router.push(`/receipt/${data.transactions[0].transaction_id}`)
      } else {
        toast.error('No registrations found')
      }
    } catch (error) {
      toast.error('Failed to retrieve receipt')
    } finally {
      setLoading(false)
    }
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-cyan-500/5" />
        <Navbar />
        <main className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                &gt; Retrieve_Receipt
              </h1>
              <p className="text-cyan-300/70 text-lg font-mono">
                Enter your email or mobile number to retrieve your registration receipt_
              </p>
            </div>

            <Card className="border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.2)] bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <CardTitle className="text-2xl font-black font-mono relative z-10">Search_Registration</CardTitle>
              </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <Label className="text-base mb-3 block text-cyan-300 font-mono">Search By</Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSearchType('email')}
                      className={`flex-1 py-3 px-6 rounded-lg font-bold font-mono transition-all ${
                        searchType === 'email'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-800/50 text-cyan-400/60 hover:bg-slate-800 border border-cyan-500/20'
                      }`}
                    >
                      Email Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('mobile')}
                      className={`flex-1 py-3 px-6 rounded-lg font-bold font-mono transition-all ${
                        searchType === 'mobile'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-800/50 text-cyan-400/60 hover:bg-slate-800 border border-cyan-500/20'
                      }`}
                    >
                      Mobile Number
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="search" className="text-base text-cyan-300 font-mono">
                    {searchType === 'email' ? 'Email Address' : 'Mobile Number'}
                  </Label>
                  <Input
                    id="search"
                    type={searchType === 'email' ? 'email' : 'tel'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={
                      searchType === 'email'
                        ? 'your.email@example.com'
                        : '10-digit mobile number'
                    }
                    className="mt-2 h-12 text-lg bg-slate-900/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/40 font-mono"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] font-mono transition-all"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {loading ? 'Searching...' : 'Search Receipt →'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-cyan-300/60 font-mono text-sm">
            <p>
              <strong className="text-cyan-400">Note:</strong> You'll see the most recent registration associated with your email or mobile number_
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
