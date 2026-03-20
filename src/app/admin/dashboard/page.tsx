'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { 
  Shield, 
  UserPlus, 
  FileDown, 
  Search,
  LogOut,
  Users,
  Trash2,
  FileText
} from 'lucide-react'

interface SubAdmin {
  id: string
  username: string
  created_at: string
}

interface Event {
  id: string
  name: string
}

export default function AdminDashboard() {
  const [username, setUsername] = useState('')
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [newSubAdminUsername, setNewSubAdminUsername] = useState('')
  const [newSubAdminPassword, setNewSubAdminPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<{id: string, username: string} | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('admin_role')
    const adminUsername = localStorage.getItem('admin_username')
    const token = localStorage.getItem('admin_token')

    if (!token) {
      router.push('/admin/login')
      return
    }

    if (role === 'sub_admin') {
      router.push('/admin/sub-admin/dashboard')
      return
    }

    setUsername(adminUsername || '')
    fetchEvents()
    fetchSubAdmins()
  }, [router])

  const fetchSubAdmins = async () => {
    try {
      const response = await fetch('/api/admin/sub-admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setSubAdmins(data.subAdmins || [])
      }
    } catch (error) {
      console.error('Failed to fetch sub-admins:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events')
      const data = await response.json()
      if (response.ok) {
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSubAdminUsername.trim() || !newSubAdminPassword.trim()) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/sub-admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({
          username: newSubAdminUsername,
          password: newSubAdminPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Sub-admin created successfully!')
        setNewSubAdminUsername('')
        setNewSubAdminPassword('')
        fetchSubAdmins()
      } else {
        toast.error(data.error || 'Failed to create sub-admin')
      }
    } catch (error) {
      toast.error('Failed to create sub-admin')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubAdmin = async (id: string, username: string) => {
    setAdminToDelete({ id, username })
    setDeleteDialogOpen(true)
  }

  const confirmDeleteSubAdmin = async () => {
    if (!adminToDelete) return
    const { id } = adminToDelete
    setDeleteDialogOpen(false)

    try {
      const response = await fetch(`/api/admin/sub-admins?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })

      if (response.ok) {
        toast.success('Sub-admin deleted successfully!')
        fetchSubAdmins()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete sub-admin')
      }
    } catch (error) {
      toast.error('Failed to delete sub-admin')
    } finally {
      setAdminToDelete(null)
    }
  }

  const handleGenerateReport = async (eventId: string) => {
    if (!eventId) {
      toast.error('Please select an event')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ eventId }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${eventId}-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Report downloaded successfully!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to generate report')
      }
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

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
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">SUPER_ADMIN</h1>
              <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest">{username}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Sub-Admin Management */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserPlus className="w-5 h-5" />
                  Create Sub-Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreateSubAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newSubAdminUsername}
                      onChange={(e) => setNewSubAdminUsername(e.target.value)}
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newSubAdminPassword}
                      onChange={(e) => setNewSubAdminPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Add Sub-Admin
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-cyan-600" />
                  Manage Sub-Admins
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {subAdmins.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No sub-admins found</p>
                ) : (
                  <div className="divide-y">
                    {subAdmins.map((admin) => (
                      <div key={admin.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-bold text-slate-900">{admin.username}</p>
                          <p className="text-xs text-slate-500 font-mono">
                            Added: {new Date(admin.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteSubAdmin(admin.id, admin.username)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reports & Verification */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Global Report */}
              <Card className="border-0 shadow-lg bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    Global Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-400 text-sm">
                    Generate a comprehensive PDF report of all registered candidates across all events.
                  </p>
                  <Button
                    onClick={() => handleGenerateReport('all')}
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Download All Candidates PDF
                  </Button>
                </CardContent>
              </Card>

              {/* Event Report */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-cyan-600" />
                    Event Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Event</Label>
                    <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => handleGenerateReport(selectedEvent)}
                    disabled={loading || !selectedEvent}
                    variant="outline"
                    className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                  >
                    Generate Event PDF
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Verification Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-cyan-400" />
                  Verify Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleVerifyRegistration} className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      value={verificationId}
                      onChange={(e) => setVerificationId(e.target.value)}
                      placeholder="Enter Registration ID (e.g. REG-123456)"
                      className="h-12"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Verify
                  </Button>
                </form>

                {verificationResult && (
                  <div className="mt-8 p-6 bg-slate-50 rounded-xl border-2 border-dashed border-cyan-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Verified Candidate Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs">NAME</p>
                        <p className="font-bold text-slate-900 text-base">{verificationResult.user_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs">EVENT</p>
                        <p className="font-bold text-cyan-600 text-base">{verificationResult.event_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs">EMAIL</p>
                        <p className="text-slate-900">{verificationResult.user_email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs">MOBILE</p>
                        <p className="text-slate-900">{verificationResult.user_mobile}</p>
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-1">
                        <p className="text-slate-500 text-xs">INSTITUTION</p>
                        <p className="text-slate-900">{verificationResult.college_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs">AMOUNT PAID</p>
                        <p className="font-bold text-green-600 text-lg">₹{verificationResult.amount_paid}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs">REGISTRATION DATE</p>
                        <p className="text-slate-900">
                          {new Date(verificationResult.created_at).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete sub-admin "{adminToDelete?.username}"?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSubAdmin}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
