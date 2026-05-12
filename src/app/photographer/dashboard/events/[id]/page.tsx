import { getEventById } from '@/app/actions/events'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { UploadZone } from './UploadZone'
import { EventImage } from './EventImage'

export const dynamic = 'force-dynamic'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="space-y-6">
          <Link href="/photographer/dashboard" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div>
            <h1 className="text-4xl font-light tracking-tight text-white">{event.name}</h1>
            <div className="flex items-center text-neutral-400 gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString()}
            </div>
          </div>
        </header>

        <section>
          <UploadZone eventId={event.id} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium">Event Gallery</h2>
            <span className="text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full text-sm">
              {event.images.length} photos
            </span>
          </div>

          {event.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.images.map((image: any) => (
                <EventImage key={image.id} objectKey={image.optimizedUrl} alt={`Event photo ${image.id}`} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-neutral-800 rounded-2xl text-neutral-500 bg-neutral-900/50">
              No photos uploaded yet.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
