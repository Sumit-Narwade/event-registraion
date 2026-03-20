import { query } from '@/lib/db'
import { EventCard } from '@/components/EventCard'
import { Navbar } from '@/components/Navbar'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Home() {
  let events: any[] = []
  
  try {
    const result = await query(
      `SELECT * FROM events ORDER BY event_date ASC`
    )
    events = result.rows.map(event => ({
      ...event,
      price: parseInt(event.price, 10),
    }));
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-cyan-500/5" />
      <Navbar />
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl animate-pulse" />
            <h1 className="text-7xl md:text-8xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent relative tracking-tight">
              TECH FEST
            </h1>
          </div>
          <p className="text-xl text-cyan-300/80 max-w-2xl mx-auto font-mono tracking-wide">
            &gt; Browse events and register for cutting-edge tech experiences_
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event, i) => (
            <div 
              key={event.id}
              style={{ animationDelay: `${i * 100}ms` }}
              className="animate-slide-up"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
        {events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-cyan-300/60 font-mono text-xl">{"// No events available"}</p>
            <p className="text-cyan-300/40 font-mono mt-2">Run the schema.sql to populate events</p>
          </div>
        )}
      </main>
    </div>
  )
}
