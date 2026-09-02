import { SectionHeader } from '@/components/ui/index'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Farmers',
  description: 'Whether you are a new farmer, experienced grower, or youth entrepreneur — My Chicken Addis is here for you.',
}

export default function ForFarmersPage() {
  const steps = [
    { emoji: '📚', title: 'Learn', desc: 'Explore our educational resources and understand poultry farming.' },
    { emoji: '📋', title: 'Plan', desc: 'Decide on your farming goals, capacity, and budget.' },
    { emoji: '🎓', title: 'Train', desc: 'Join our practical training courses for hands-on learning.' },
    { emoji: '💰', title: 'Finance', desc: 'Explore financing opportunities to fund your farm.' },
    { emoji: '🐔', title: 'Get Birds', desc: 'Order quality 45-day broiler birds for your farm.' },
    { emoji: '🌾', title: 'Get Feed', desc: 'Purchase quality feed for every stage of bird growth.' },
    { emoji: '🏡', title: 'Farm', desc: 'Apply what you learned and grow healthy birds.' },
    { emoji: '📈', title: 'Grow', desc: 'Expand your farm and build a sustainable business.' },
  ]

  return (
    <>
      <section className="relative py-16 bg-brand-bg overflow-hidden border-b border-brand-gray-200">
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="For Farmers"
            title="Your Poultry Farming Journey"
            description="Whether you're just starting out or looking to expand, we have everything you need."
          />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <div key={step.title} className="text-center p-6 bg-white rounded-xl border border-brand-gray-200 hover:border-brand-cyan/30 transition-colors">
                <div className="text-4xl mb-4">{step.emoji}</div>
                <div className="text-xs text-brand-cyan font-bold tracking-widest uppercase mb-2">Step {idx + 1}</div>
                <h3 className="font-bold text-brand-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-brand-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}



