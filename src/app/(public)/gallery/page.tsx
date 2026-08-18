import { SectionHeader } from '@/components/ui/index'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from My Chicken Addis — our farm, birds, training sessions, events, and community.',
}

export default function GalleryPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="Gallery"
            title="Our Gallery"
            description="Photos from our farm, training sessions, events, and community activities."
          />
          </div>
        </div>
      </section>
      
      <section className="section-padding bg-brand-dark min-h-[50vh]">
        <div className="container-main">
          <div className="text-center text-brand-muted py-16">
            <p className="text-lg">Gallery coming soon.</p>
          </div>
        </div>
      </section>
    </>
  )
}



