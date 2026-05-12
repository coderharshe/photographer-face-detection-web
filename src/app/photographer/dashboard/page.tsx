import { getEvents, createEvent } from '@/app/actions/events'
import Link from 'next/link'
import { PlusCircle, Calendar, Image as ImageIcon } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default async function PhotographerDashboard() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-white">Your Events</h1>
            <p className="text-neutral-400 mt-2">Manage your photography events and upload galleries.</p>
          </div>
        </header>

        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-2xl font-medium mb-6">Create New Event</h2>
          <form action={createEvent} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="name" className="text-sm text-neutral-400">Event Name</label>
              <input 
                id="name"
                name="name" 
                type="text" 
                required 
                placeholder="e.g. Smith Wedding" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label htmlFor="date" className="text-sm text-neutral-400">Event Date</label>
              <input 
                id="date"
                name="date" 
                type="date" 
                required 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 h-[50px]"
            >
              <PlusCircle className="w-5 h-5" />
              Create
            </button>
          </form>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <Link href={`/photographer/dashboard/events/${event.id}`} key={event.id}>
              <div className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium mb-2 group-hover:text-white transition-colors">{event.name}</h3>
                  <div className="flex items-center text-sm text-neutral-400 gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-sm text-neutral-500">
                  <span>View Details</span>
                  <span className="flex items-center gap-1"><ImageIcon className="w-4 h-4" /></span>
                </div>
              </div>
            </Link>
          ))}
          {events.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              No events found. Create your first event above.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
