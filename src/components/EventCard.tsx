'use client'

import { Calendar, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event } from '@/lib/cart-store'

interface EventCardProps {
  event: Event & { max_participants?: number | null }
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="overflow-hidden group hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500 border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-sm hover:border-cyan-400/50 hover:translate-y-[-4px]">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        {event.category && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none font-mono tracking-wide">
            {event.category}
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-2xl font-black mb-3 text-cyan-300 group-hover:text-cyan-400 transition-colors font-mono tracking-wide">
          {event.name}
        </h3>
        <p className="text-cyan-100/60 mb-4 line-clamp-2 text-sm">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-cyan-300/70 font-mono">
            <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
            {formattedDate}
          </div>
          <div className="flex items-center text-sm text-cyan-300/70 font-mono">
            <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
            {event.venue}
          </div>
          {event.max_participants && (
            <div className="flex items-center text-sm text-cyan-300/70 font-mono">
              <Users className="w-4 h-4 mr-2 text-cyan-400" />
              Max {event.max_participants} participants
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-cyan-500/10">
        <div className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-mono">₹{event.price}</div>
        <Link href={`/events/${event.id}`}>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none font-mono shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
            View Details →
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
