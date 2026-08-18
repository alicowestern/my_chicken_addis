import { SectionHeader } from '@/components/ui/index'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming poultry farming events, training sessions, and community activities from My Chicken Addis.',
}

export default function EventsPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="Events"
            title="Upcoming Events"
            description="Join our training sessions, community gatherings, and industry events."
          />
          </div>
        </div>
      </section>
      
      <section className="section-padding bg-brand-dark min-h-[50vh]">
        <div className="container-main">
          <div className="text-center text-brand-muted py-16">
            <p className="text-lg">No upcoming events at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    </>
  )
}



