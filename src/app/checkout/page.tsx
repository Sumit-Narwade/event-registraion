'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    collegeName: '',
    address: '',
  })

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.mobile || !formData.collegeName || !formData.address) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotalPrice(),
          events: items,
          userData: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'TECH FEST 2025',
        description: 'Tech Fest Event Registration',
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                events: items,
                userData: formData,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              router.push(`/receipt/${verifyData.transactionId}`)
            } else {
              toast.error('Payment verification failed')
            }
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#06b6d4',
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error('Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-cyan-500/5" />
      <Navbar />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
              &gt; Registration_Details
            </h1>
            <Card className="border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-cyan-300 font-mono">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="mt-2 bg-slate-900/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/40 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-cyan-300 font-mono">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="mt-2 bg-slate-900/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/40 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile" className="text-cyan-300 font-mono">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="mt-2 bg-slate-900/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/40 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="collegeName" className="text-cyan-300 font-mono">College Name *</Label>
                    <Input
                      id="collegeName"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      placeholder="Enter your college name"
                      className="mt-2 bg-slate-900/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/40 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-cyan-300 font-mono">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your complete address"
                      className="mt-2 bg-slate-900/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/40 font-mono"
                      rows={3}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] font-mono transition-all"
                  >
                    {loading ? 'Processing...' : `Pay ₹${getTotalPrice()} →`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-6 text-cyan-300 font-mono">&gt; Order_Summary</h2>
            <div className="space-y-4">
              {items.map((event) => (
                <Card key={event.id} className="border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] overflow-hidden bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                          alt={event.name}
                          fill
                          className="object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80" />
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-black text-cyan-300 font-mono">{event.name}</h3>
                        <p className="text-sm text-cyan-400/60 font-mono">{event.venue}</p>
                        <div className="text-lg font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mt-2 font-mono">₹{event.price}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-300 font-mono">Total Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-mono">₹{getTotalPrice()}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
