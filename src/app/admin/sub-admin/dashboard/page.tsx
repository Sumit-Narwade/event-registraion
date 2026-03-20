'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  Shield, 
  Search,
  LogOut,
  UserCheck
} from 'lucide-react'

export default function SubAdminDashboard() {
  const [username, setUsername] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('admin_role')
    const adminUsername = localStorage.getItem('admin_username')
    const token = localStorage.getItem('admin_token')

    if (!token) {
      router.push('/admin/sub-admin/login')
      return
    }

    if (role === 'main_admin') {
      router.push('/admin/dashboard')
      return
    }

    setUsername(adminUsername || '')
  }, [router])

  const handleVerifyRegistration = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationId.trim()) {
      toast.error('Please enter a registration ID')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/verify-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ registrationId: verificationId }),
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationResult(data.registration)
        toast.success('Registration found!')
      } else {
        toast.error(data.error || 'Registration not found')
        setVerificationResult(null)
      }
    } catch (error) {
      toast.error('Verification failed')
      setVerificationResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_role')
    localStorage.removeItem('admin_username')
    router.push('/admin/sub-admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
                SUB_ADMIN_PANEL
              </h1>
              <p className="text-xs text-purple-300/60 font-mono">{username}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 font-mono"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white font-mono tracking-tight">VERIFY_REGISTRATION</h2>
            <p className="text-purple-300/60 font-mono">Enter Registration ID to confirm candidate details</p>
          </div>

          <Card className="border border-purple-500/20 bg-slate-900/50 backdrop-blur-sm shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <CardContent className="p-8">
              <form onSubmit={handleVerifyRegistration} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="registrationId" className="text-purple-300 font-mono uppercase text-xs tracking-widest">Registration ID</Label>
                  <Input
                    id="registrationId"
                    value={verificationId}
                    onChange={(e) => setVerificationId(e.target.value)}
                    placeholder="E.g. REG-123456"
                    className="bg-slate-950 border-purple-500/30 text-purple-100 placeholder:text-purple-500/30 h-12 font-mono"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Verifying...' : 'Search Registration'}
                </Button>
              </form>

              {verificationResult && (
                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-mono font-bold">REGISTRATION_VERIFIED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-6 bg-slate-950 rounded-xl border border-purple-500/20 font-mono text-sm">
                    <div className="space-y-1">
                      <p className="text-purple-300/40 text-xs">CANDIDATE_NAME</p>
                      <p className="text-purple-100 font-bold">{verificationResult.user_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-purple-300/40 text-xs">EVENT_NAME</p>
                      <p className="text-cyan-400 font-bold">{verificationResult.event_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-purple-300/40 text-xs">EMAIL_ADDRESS</p>
                      <p className="text-purple-100 truncate">{verificationResult.user_email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-purple-300/40 text-xs">MOBILE_NUMBER</p>
                      <p className="text-purple-100">{verificationResult.user_mobile}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-purple-300/40 text-xs">INSTITUTION</p>
                      <p className="text-purple-100">{verificationResult.college_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-purple-300/40 text-xs">AMOUNT_PAID</p>
                      <p className="text-green-400 font-bold">₹{verificationResult.amount_paid}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-purple-300/40 text-xs">DATE_REGISTERED</p>
                      <p className="text-purple-100">
                        {new Date(verificationResult.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
