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
      {/* Hero Section */}
      <section className="relative py-20 lg:py-24 bg-brand-gray-50 overflow-hidden border-b border-brand-gray-200">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-pattern opacity-30" />
        </div>
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-cyan-dark font-bold tracking-widest text-sm uppercase mb-4">Premium Poultry</p>
            <h1 className="mb-6 text-center text-brand-gray-900">Quality 45-Day Birds</h1>
            <p className="text-lg sm:text-xl text-brand-gray-600 leading-relaxed font-light text-center">
              Our broilers are bred for optimal health, fast growth, and high meat yield. Ready for the market in exactly 45 days.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
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

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="mb-16 page-hero mx-auto">
            <h2 className="mb-4 text-center">Why Choose Our Birds?</h2>
            <p className="subheading max-w-2xl text-center">
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
              <div key={feature.title} className="bg-brand-gray-50 p-8 rounded-xl border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 rounded-full bg-brand-cyan-dim flex items-center justify-center text-brand-cyan-dark mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-gray-900 mb-3">{feature.title}</h3>
                <p className="text-brand-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div id="order-form" className="scroll-mt-24 max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-brand-gray-200 shadow-lg">
            <h3 className="text-3xl font-bold font-heading text-brand-gray-900 mb-3">Request Bird Order</h3>
            <p className="text-brand-gray-600 mb-10">Fill out the form below to request a bird order. Our team will contact you to confirm details.</p>
            <BirdOrderForm products={products} />
          </div>
        </div>
      </section>

      {/* Cycle Section */}
      <section className="section-padding bg-brand-gray-50 border-t border-brand-gray-200">
        <div className="container-main">
          <SectionHeader
            label="Growth Cycle"
            title="The 45-Day Journey"
            description="A proven timeline for optimal growth and profitability."
          />
          
          <div className="max-w-4xl mx-auto mt-12">
            <div className="space-y-6">
              {[
                { days: 'Days 1-14', title: 'Brooding & Starter Phase', desc: 'Critical early development requiring strict temperature control and highly nutritious starter feed.' },
                { days: 'Days 15-28', title: 'Grower Phase', desc: 'Rapid skeletal and muscle development phase fueled by our specially formulated grower feed.' },
                { days: 'Days 29-45', title: 'Finisher Phase', desc: 'Final weight gain and fat deposition phase preparing the birds for market.' },
              ].map((stage, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-6 sm:p-8 rounded-xl border border-brand-gray-200 shadow-sm transition-all hover:shadow-md">
                  <div className="w-32 flex-shrink-0">
                    <span className="inline-block bg-brand-cyan-dim text-brand-cyan-dark font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full">{stage.days}</span>
                  </div>
                  <div className="page-hero sm:items-start sm:text-left">
                    <h4 className="text-xl font-bold text-brand-gray-900 mb-2">{stage.title}</h4>
                    <p className="text-brand-gray-600">{stage.desc}</p>
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
