'use client'

import { Navbar } from '@/components/Navbar'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, ShoppingBag, Zap } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0118] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f051a_1px,transparent_1px),linear-gradient(to_bottom,#0f051a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <Navbar />
        <main className="container mx-auto px-4 py-12 relative z-10">
          <Card className="max-w-2xl mx-auto text-center p-12 bg-[#0f051a]/80 border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <div className="relative inline-block">
              <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-cyan-400/30" />
              <div className="absolute inset-0 blur-xl bg-cyan-500/20" />
            </div>
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent [text-shadow:0_0_30px_rgba(6,182,212,0.3)]">
              CART EMPTY
            </h2>
            <p className="text-gray-400 mb-8 text-lg font-mono">{"// Initialize your tech journey"}</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-8 py-6 text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all border border-cyan-400/50"
            >
              <Zap className="w-5 h-5 mr-2" />
              Explore Events
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0118] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f051a_1px,transparent_1px),linear-gradient(to_bottom,#0f051a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black mb-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse [text-shadow:0_0_30px_rgba(6,182,212,0.3)]">
            {'<CART/>'}
          </h1>
          
          <div className="space-y-6 mb-8">
            {items.map((event, index) => (
              <Card 
                key={event.id} 
                className="bg-[#0f051a]/80 border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden hover:border-cyan-400/40 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] group"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <CardContent className="p-0">
                  <div className="flex gap-6">
                    <div className="relative w-56 h-56 flex-shrink-0 overflow-hidden">
                      <Image
                        src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                        alt={event.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f051a] via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-2 left-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 px-3 py-1 rounded-full">
                        <span className="text-cyan-400 text-xs font-mono font-bold">EVENT #{event.id}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text mb-3 group-hover:from-cyan-200 group-hover:to-blue-300 transition-all">
                          {event.name}
                        </h3>
                        <p className="text-gray-400 line-clamp-2 mb-4 font-mono text-sm">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-cyan-400/70 font-mono">
                          <Zap className="w-4 h-4" />
                          {event.venue}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyan-500/10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            ₹{event.price}
                          </span>
                          <span className="text-gray-500 font-mono text-sm">INR</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(event.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/40 transition-all font-mono"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          DELETE
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[#0f051a]/80 border border-purple-500/20 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            <CardHeader>
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {'// ORDER SUMMARY'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between text-xl font-mono">
                <span className="text-gray-400">Items.length = {items.length}</span>
                <span className="font-bold text-cyan-400">₹{getTotalPrice()}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="flex justify-between text-3xl font-black">
                <span className="text-white">TOTAL</span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
                  ₹{getTotalPrice()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 pt-6">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1 border-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 font-bold text-lg h-14 transition-all font-mono backdrop-blur-sm"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                CLEAR
              </Button>
              <Button
                onClick={() => router.push('/checkout')}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-black font-black text-lg h-14 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all border border-cyan-400/50"
              >
                <Zap className="w-5 h-5 mr-2" />
                CHECKOUT →
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
