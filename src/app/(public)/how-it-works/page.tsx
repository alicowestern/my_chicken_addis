import { SectionHeader } from '@/components/ui/index'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how My Chicken Addis helps you start and grow a successful poultry business — step by step.',
}

export default function HowItWorksPage() {
  const steps = [
    { num: '01', title: 'Discover', desc: 'Learn about our services and how poultry farming can work for you.' },
    { num: '02', title: 'Learn', desc: 'Read our educational content and attend informational sessions.' },
    { num: '03', title: 'Plan', desc: 'Work out your farming goals, budget, and capacity requirements.' },
    { num: '04', title: 'Train', desc: 'Join our practical training programs for hands-on skills.' },
    { num: '05', title: 'Explore Financing', desc: 'Connect with financing opportunities to fund your farm.' },
    { num: '06', title: 'Get Birds', desc: 'Order quality 45-day birds to start your farm.' },
    { num: '07', title: 'Get Feed', desc: 'Purchase nutritional feed for all growth stages.' },
    { num: '08', title: 'Farm', desc: 'Apply your training and raise healthy, profitable birds.' },
    { num: '09', title: 'Grow', desc: 'Expand your farm and build a sustainable poultry business.' },
  ]

  return (
    <>
      <section className="relative py-16 bg-brand-bg overflow-hidden border-b border-brand-gray-200">
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="How It Works"
            title="From Discovery to Growth"
            description="A simple step-by-step path to building your poultry business."
          />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="max-w-3xl mx-auto space-y-6">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-6 items-start bg-white p-6 rounded-xl border border-brand-gray-200">
                <div className="w-14 h-14 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg font-heading">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-brand-gray-900 text-xl mb-1">{step.title}</h3>
                  <p className="text-brand-gray-600 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}



