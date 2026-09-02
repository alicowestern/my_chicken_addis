import { SectionHeader } from '@/components/ui/index'
import { getActiveFAQs } from '@/lib/actions/public'
import FAQAccordion from './FAQAccordion'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about My Chicken Addis — birds, feed, training, financing, and more.',
}

export default async function FAQPage() {
  const result = await getActiveFAQs()
  const faqs = result.success ? result.data : []

  // Group by category
  const grouped = faqs.reduce((acc: Record<string, typeof faqs>, faq) => {
    const cat = faq.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  const categoryLabels: Record<string, string> = {
    BIRDS: '🐔 Birds',
    FEED: '🌾 Feed',
    TRAINING: '📚 Training',
    FINANCING: '💰 Financing',
    GENERAL: '❓ General',
  }

  const categoryOrder = ['BIRDS', 'FEED', 'TRAINING', 'FINANCING', 'GENERAL']

  return (
    <>
      <section className="relative py-16 bg-brand-bg overflow-hidden border-b border-brand-gray-200">
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="Support"
              title="Frequently Asked Questions"
              description="Find answers to common questions about our services."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          {faqs.length === 0 ? (
            <p className="text-center text-brand-gray-500 py-12">No FAQs available yet. Check back soon!</p>
          ) : (
            <div className="space-y-12">
              {categoryOrder
                .filter((cat) => grouped[cat]?.length > 0)
                .map((cat) => (
                  <div key={cat}>
                    <h2 className="text-xl font-bold text-brand-gray-900 mb-6 text-left">
                      {categoryLabels[cat] || cat}
                    </h2>
                    <FAQAccordion items={grouped[cat]} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
