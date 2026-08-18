import { SectionHeader } from '@/components/ui/index'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about poultry farming, 45-day birds, feed, training, and financing from My Chicken Addis.',
}

const faqData = [
  {
    category: 'Birds',
    questions: [
      { q: 'What are 45-day birds?', a: 'These are broiler chickens that are raised to reach optimal market weight within approximately 45 days.' },
      { q: 'How do I order birds?', a: 'You can request birds through our website or by contacting us via phone or WhatsApp.' },
    ],
  },
  {
    category: 'Feed',
    questions: [
      { q: 'What types of feed do you offer?', a: 'We offer starter, grower, and finisher feeds suitable for different stages of bird growth.' },
    ],
  },
  {
    category: 'Training',
    questions: [
      { q: 'Who can attend training?', a: 'Our training is open to new farmers, existing farmers, youth entrepreneurs, and anyone interested in poultry farming.' },
    ],
  },
  {
    category: 'Financing',
    questions: [
      { q: 'Does My Chicken Addis provide loans?', a: 'We do not directly provide loans. We help connect farmers with financing opportunities through our collaboration with Life Saving Credit. The financing partner makes all final decisions.' },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="Help Center"
            title="Frequently Asked Questions"
            description="Find answers to common questions about our products and services."
          />
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqData.map((section) => (
              <div key={section.category}>
                <h3 className="text-xl font-bold font-heading text-brand-white mb-6 pb-2 border-b border-[rgba(255,255,255,0.1)]">
                  {section.category}
                </h3>
                <div className="space-y-4">
                  {section.questions.map((faq) => (
                    <div key={faq.q} className="bg-brand-surface rounded-xl p-6 border border-[rgba(255,255,255,0.05)]">
                      <h4 className="font-bold text-brand-cyan mb-2">{faq.q}</h4>
                      <p className="text-sm text-brand-light-gray leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}



