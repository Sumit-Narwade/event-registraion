'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, Tag, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore, Event } from '@/lib/cart-store'
import { toast } from 'sonner'

interface EventDetailsProps {
  event: Event & { max_participants?: number | null; created_at?: string }
}

export function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter()
  const { addItem, items } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  
  const isInCart = items.some((item) => item.id === event.id)

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedTime = new Date(event.event_date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(event)
    toast.success('Added to cart!')
    setTimeout(() => setIsAdding(false), 500)
  }

  const handleRegisterNow = () => {
    addItem(event)
    router.push('/checkout')
  }

    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)] border border-cyan-500/20">
              <Image
                src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                alt={event.name}
                fill
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
              {event.category && (
                <Badge className="absolute top-6 left-6 text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-none font-mono">
                  {event.category}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono tracking-wide">
                {event.name}
              </h1>
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-6 font-mono">₹{event.price}</div>
            </div>

            <Card className="border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-cyan-300 font-mono">{formattedDate}</div>
                    <div className="text-sm text-cyan-400/60">Event Date</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-cyan-300 font-mono">{formattedTime}</div>
                    <div className="text-sm text-cyan-400/60">Start Time</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-cyan-300 font-mono">{event.venue}</div>
                    <div className="text-sm text-cyan-400/60">Venue</div>
                  </div>
                </div>
                {event.max_participants && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="font-bold text-cyan-300 font-mono">{event.max_participants} Participants</div>
                      <div className="text-sm text-cyan-400/60">Maximum Capacity</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={handleRegisterNow}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] font-mono transition-all"
              >
                Register Now →
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={isInCart || isAdding}
                variant="outline"
                className="h-14 px-8 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-mono"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>

        <Card className="mt-12 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-cyan-300 font-mono">
              <Tag className="w-8 h-8 text-cyan-400" />
              About This Event
            </h2>
            <p className="text-lg text-cyan-100/70 leading-relaxed">{event.description}</p>
          </CardContent>
        </Card>
      </div>
    )
}
