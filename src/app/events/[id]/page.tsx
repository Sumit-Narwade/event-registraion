import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import { Navbar } from '@/components/Navbar'
import { EventDetails } from '@/components/EventDetails'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  let event = null
  try {
    const result = await query(
      `SELECT * FROM events WHERE id = $1`,
      [id]
    )
    event = result.rows[0]
    if (event) {
      if (typeof event.price === 'string') {
        event.price = parseInt(event.price, 10);
      }
      if (event.event_date instanceof Date) {
        event.event_date = event.event_date.toISOString();
      }
    }

  } catch (error) {
    console.error('Failed to fetch event:', error)
  }

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-cyan-500/5" />
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative z-10">
        <EventDetails event={event} />
      </main>
    </div>
  )
}
