'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserCheck } from 'lucide-react'

export default function SubAdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Invalid credentials')
        return
      }

      if (data.role !== 'sub_admin') {
        toast.error('This portal is for sub-admins only')
        return
      }

      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_role', data.role)
      localStorage.setItem('admin_username', data.username)

      toast.success('Login successful!')
      router.push('/admin/sub-admin/verify')
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-cyan-500/5" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-full mb-4 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <UserCheck className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2 font-mono">SUB_ADMIN_PORTAL</h1>
            <p className="text-purple-300/70 font-mono">Verification & Receipt Management</p>
          </div>

          <Card className="border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)] bg-gradient-to-br from-slate-900/90 to-purple-900/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-center text-purple-300 font-mono">&gt; Sign_In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-purple-300 font-mono">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="mt-2 h-12 bg-slate-900/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/40 font-mono"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-purple-300 font-mono">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mt-2 h-12 bg-slate-900/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/40 font-mono"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] font-mono transition-all"
                >
                  {loading ? 'Signing in...' : 'Sign In →'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 font-mono"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
}
