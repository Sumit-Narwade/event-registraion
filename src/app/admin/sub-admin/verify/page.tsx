'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Search, LogOut, Receipt as ReceiptIcon, CheckCircle, XCircle, User, Mail, Phone, Calendar, MapPin, CreditCard, Fingerprint } from 'lucide-react'

interface Registration {
  id: string
  registration_id: string
  transaction_id: string
  full_name: string
  email: string
  mobile: string
  event_name: string
  event_venue: string
  event_date: string
  total_amount: number
  payment_status: string
  created_at: string
}

export default function SubAdminVerifyPage() {
  const [searchType, setSearchType] = useState<'registration' | 'transaction' | 'email' | 'mobile'>('registration')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const role = localStorage.getItem('admin_role')
    const storedUsername = localStorage.getItem('admin_username')

    if (!token || (role !== 'sub_admin' && role !== 'main_admin')) {
      router.push('/admin/sub-admin/login')
      return
    }

    setUsername(storedUsername || '')
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_role')
    localStorage.removeItem('admin_username')
    router.push('/admin/sub-admin/login')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchValue.trim()) {
      toast.error('Please enter a search value')
      return
    }

    setLoading(true)
    setRegistration(null)

    try {
      const params = new URLSearchParams()
      params.append(searchType, searchValue)

      const response = await fetch(`/api/admin/verify-registration?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Registration not found')
        return
      }

      setRegistration(data.registration)
      toast.success('Registration found!')
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-cyan-500/5" />
        
        <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-lg relative z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-purple-200 font-bold font-mono">{username}</h2>
                <p className="text-xs text-purple-400 font-mono">VERIFICATION_OFFICER</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="ghost"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-mono"
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 font-mono"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-full mb-4 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Fingerprint className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2 font-mono">APPLICANT_VERIFY</h1>
              <p className="text-purple-300/70 text-lg font-mono">&gt; Fetch information by Registration ID, Transaction, Email, or Mobile_</p>
            </div>

          <Card className="border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)] bg-gradient-to-br from-slate-900/90 to-purple-900/60 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-purple-300 font-mono">&gt; Search_Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <Label className="text-purple-300 font-mono">Search By</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <Button
                      type="button"
                      variant={searchType === 'registration' ? 'default' : 'outline'}
                      onClick={() => setSearchType('registration')}
                      className={searchType === 'registration' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 border-0 font-mono' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-mono'}
                    >
                      Reg. ID
                    </Button>
                    <Button
                      type="button"
                      variant={searchType === 'transaction' ? 'default' : 'outline'}
                      onClick={() => setSearchType('transaction')}
                      className={searchType === 'transaction' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 border-0 font-mono' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-mono'}
                    >
                      Txn ID
                    </Button>
                    <Button
                      type="button"
                      variant={searchType === 'email' ? 'default' : 'outline'}
                      onClick={() => setSearchType('email')}
                      className={searchType === 'email' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 border-0 font-mono' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-mono'}
                    >
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={searchType === 'mobile' ? 'default' : 'outline'}
                      onClick={() => setSearchType('mobile')}
                      className={searchType === 'mobile' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 border-0 font-mono' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-mono'}
                    >
                      Mobile
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="searchValue" className="text-purple-300 font-mono">
                    {searchType === 'registration' && 'Registration ID'}
                    {searchType === 'transaction' && 'Transaction ID'}
                    {searchType === 'email' && 'Email Address'}
                    {searchType === 'mobile' && 'Mobile Number'}
                  </Label>
                  <Input
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={
                      searchType === 'registration'
                        ? 'Enter registration ID (e.g., REG-123456)'
                        : searchType === 'transaction'
                        ? 'Enter transaction ID'
                        : searchType === 'email'
                        ? 'Enter email address'
                        : 'Enter mobile number'
                    }
                    className="mt-2 h-12 bg-slate-900/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/40 font-mono"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] font-mono transition-all"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {loading ? 'Fetching...' : 'Fetch Applicant Info →'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {registration && (
            <Card className="border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)] bg-gradient-to-br from-slate-900/90 to-purple-900/60 backdrop-blur-sm">
              <CardHeader className="border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-black text-purple-300 flex items-center font-mono">
                    {registration.payment_status === 'completed' ? (
                      <CheckCircle className="w-8 h-8 mr-3 text-green-400" />
                    ) : (
                      <XCircle className="w-8 h-8 mr-3 text-red-400" />
                    )}
                    &gt; Applicant_Details
                  </CardTitle>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold font-mono ${
                      registration.payment_status === 'completed'
                        ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                        : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    }`}>
                      {registration.payment_status === 'completed' ? 'PAID' : 'PENDING'}
                    </span>
                    <span className="text-xs text-purple-400 font-mono">ID: {registration.registration_id}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Full Name</p>
                        <p className="text-lg font-bold text-purple-100">{registration.full_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Email</p>
                        <p className="text-lg text-purple-100">{registration.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Mobile</p>
                        <p className="text-lg text-purple-100">{registration.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Fingerprint className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Registration ID</p>
                        <p className="text-lg font-mono font-bold text-purple-400">{registration.registration_id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ReceiptIcon className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Event</p>
                        <p className="text-lg font-bold text-purple-100">{registration.event_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Venue</p>
                        <p className="text-lg text-purple-100">{registration.event_venue}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Event Date</p>
                        <p className="text-lg text-purple-100">
                          {new Date(registration.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm text-purple-300/70 font-semibold font-mono">Paid Amount</p>
                        <p className="text-2xl font-black text-purple-400">₹{registration.total_amount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-purple-500/20">
                  <Button
                    onClick={() => window.open(`/receipt/${registration.transaction_id}`, '_blank')}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] font-mono transition-all"
                  >
                    <ReceiptIcon className="w-5 h-5 mr-2" />
                    View Applicant Receipt →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
