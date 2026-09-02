import { SectionHeader } from '@/components/ui/index'
import { getUpcomingEvents } from '@/lib/actions/public'
import EventsList from './EventsList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events, training sessions, and industry gatherings by My Chicken Addis.',
}

export default async function EventsPage() {
  const result = await getUpcomingEvents()
  const events = result.success ? result.data : []

  return (
    <>
      <section className="relative py-16 bg-brand-bg overflow-hidden border-b border-brand-gray-200">
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="Community"
              title="Upcoming Events"
              description="Join us at our upcoming events, training sessions, and farm visits."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-4xl">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brand-gray-500 text-lg mb-4">No upcoming events at the moment.</p>
              <p className="text-brand-gray-500 text-sm">Follow us on social media for announcements!</p>
            </div>
          ) : (
            <EventsList events={events} />
          )}
        </div>
      </section>
    </>
  )
}
