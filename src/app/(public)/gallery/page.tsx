import { SectionHeader } from '@/components/ui/index'
import { getGalleryMedia } from '@/lib/actions/public'
import GalleryGrid from './GalleryGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos and videos from My Chicken Addis farms, training sessions, and events.',
}

export default async function GalleryPage() {
  const result = await getGalleryMedia()
  const media = result.success ? result.data : []

  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="Our Work"
              title="Farm & Event Gallery"
              description="Take a look inside our operations, see our birds, and view moments from our community training sessions."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          {media.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brand-muted text-lg mb-4">No gallery items available yet.</p>
              <p className="text-brand-muted text-sm">We're building up our photo collection. Check back soon!</p>
            </div>
          ) : (
            <GalleryGrid items={media} />
          )}
        </div>
      </section>
    </>
  )
}
