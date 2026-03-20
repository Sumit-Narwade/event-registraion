'use client'

import Link from 'next/link'
import { ShoppingCart, Ticket, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const items = useCartStore((state) => state.items)
  const router = useRouter()

  return (
    <nav className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 blur-xl group-hover:bg-cyan-400/40 transition-all" />
              <Ticket className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform relative" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-mono tracking-wider">
              TECH_FEST
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => router.push('/retrieve-receipt')}
              variant="ghost" 
              className="text-cyan-300 hover:text-cyan-400 hover:bg-cyan-500/10 font-mono"
            >
              Get Receipt
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-cyan-500/10 text-cyan-400">
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-none font-mono">
                    {items.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="ghost" size="icon" className="hover:bg-cyan-500/10 text-cyan-400">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
