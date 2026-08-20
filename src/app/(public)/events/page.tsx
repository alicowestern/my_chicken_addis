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
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
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

      <section className="section-padding bg-brand-dark">
        <div className="container-main max-w-4xl">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brand-muted text-lg mb-4">No upcoming events at the moment.</p>
              <p className="text-brand-muted text-sm">Follow us on social media for announcements!</p>
            </div>
          ) : (
            <EventsList events={events} />
          )}
        </div>
      </section>
    </>
  )
}
