import { SectionHeader } from '@/components/ui/index'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Bird, CheckCircle2, Clock, ShieldCheck, TrendingUp } from 'lucide-react'
import { getAvailableBirdProducts } from '@/lib/actions/public'
import BirdOrderForm from './BirdOrderForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '45-Day Birds',
  description: 'Quality broiler chicks bred for optimal growth and health, ready for market in just 45 days.',
}

export default async function BirdsPage() {
  const result = await getAvailableBirdProducts()
  const products = result.success ? result.data : []

  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="Premium Poultry"
              title="Quality 45-Day Birds"
              description="Our broilers are bred for optimal health, fast growth, and high meat yield. Ready for the market in exactly 45 days."
            />
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="#order-form">
                <Button size="lg" className="rounded-full">Request Birds</Button>
              </a>
              <Link href="/feed">
                <Button size="lg" variant="secondary" className="rounded-full">View Compatible Feed</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-center">Why Choose Our Birds?</h2>
            <p className="subheading max-w-2xl mx-auto text-center">
              We source and raise our chicks with strict adherence to quality and biosecurity standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Fast Maturation',
                description: 'Optimized genetics ensuring birds reach target market weight efficiently in 45 days.',
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'High Livability',
                description: 'Strong, vaccinated chicks with excellent immunity and survival rates.',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'High Meat Yield',
                description: 'Excellent feed conversion ratio resulting in superior meat production.',
              },
              {
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: 'Veterinary Support',
                description: 'Backed by our experts to ensure your flock stays healthy throughout the cycle.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-brand-surface p-8 rounded-xl border border-[rgba(255,255,255,0.05)] hover:border-brand-cyan/30 transition-colors">
                <div className="w-14 h-14 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-white mb-3">{feature.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div id="order-form" className="scroll-mt-24 max-w-4xl mx-auto bg-brand-surface rounded-2xl p-8 border border-[rgba(255,255,255,0.05)] shadow-card">
            <h3 className="text-2xl font-bold font-heading text-brand-white mb-2">Request Bird Order</h3>
            <p className="text-brand-muted text-sm mb-8">Fill out the form below to request a bird order. Our team will contact you to confirm details.</p>
            <BirdOrderForm products={products} />
          </div>
        </div>
      </section>

      {/* Cycle Section */}
      <section className="section-padding bg-brand-dark-deep border-t border-[rgba(255,255,255,0.05)]">
        <div className="container-main">
          <SectionHeader
            label="Growth Cycle"
            title="The 45-Day Journey"
            description="A proven timeline for optimal growth and profitability."
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { days: 'Days 1-14', title: 'Brooding & Starter Phase', desc: 'Critical early development requiring strict temperature control and highly nutritious starter feed.' },
                { days: 'Days 15-28', title: 'Grower Phase', desc: 'Rapid skeletal and muscle development phase fueled by our specially formulated grower feed.' },
                { days: 'Days 29-45', title: 'Finisher Phase', desc: 'Final weight gain and fat deposition phase preparing the birds for market.' },
              ].map((stage, idx) => (
                <div key={idx} className="flex gap-6 items-start bg-brand-surface p-6 rounded-xl border border-[rgba(255,255,255,0.05)]">
                  <div className="w-24 flex-shrink-0 pt-1">
                    <span className="text-brand-cyan font-bold text-sm tracking-widest uppercase">{stage.days}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-white mb-2">{stage.title}</h4>
                    <p className="text-brand-muted text-sm">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
