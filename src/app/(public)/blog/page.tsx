import { SectionHeader } from '@/components/ui/index'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Poultry farming news, farmer stories, educational articles, and community updates from My Chicken Addis.',
}

export default function BlogPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="Blog"
            title="News & Insights"
            description="Poultry farming tips, farmer stories, company news, and educational content."
          />
          </div>
        </div>
      </section>
      
      <section className="section-padding bg-brand-dark min-h-[50vh]">
        <div className="container-main">
          <div className="text-center text-brand-muted py-16">
            <p className="text-lg">Coming soon — check back for articles and farmer stories.</p>
          </div>
        </div>
      </section>
    </>
  )
}



