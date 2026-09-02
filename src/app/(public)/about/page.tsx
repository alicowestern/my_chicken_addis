import { SectionHeader } from '@/components/ui/index'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { Bird, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about My Chicken Addis — our mission, vision, and commitment to Ethiopian poultry farmers.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-24 bg-brand-gray-50 overflow-hidden border-b border-brand-gray-200">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-pattern opacity-30" />
        </div>
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-cyan-dark font-bold tracking-widest text-sm uppercase mb-4">Our Story</p>
            <h1 className="mb-6">About Us</h1>
            <p className="text-lg sm:text-xl text-brand-gray-600 leading-relaxed font-light">
              We are an Ethiopian poultry enterprise dedicated to transforming the agricultural sector by empowering farmers with quality birds, premium feed, expert knowledge, and growth opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <Card hover className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-cyan-dim flex items-center justify-center text-brand-cyan-dark mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-3xl mb-4 font-heading text-brand-gray-900">Our Mission</h2>
              <p className="text-brand-gray-600 leading-relaxed">
                To build a sustainable and highly productive poultry ecosystem in Ethiopia by providing farmers with reliable access to 45-day birds, scientifically formulated feed, and comprehensive support services.
              </p>
            </Card>

            <Card hover className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-cyan-dim flex items-center justify-center text-brand-cyan-dark mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl mb-4 font-heading text-brand-gray-900">Our Vision</h2>
              <p className="text-brand-gray-600 leading-relaxed">
                To become the most trusted poultry partner in East Africa, recognized for our commitment to farmer success, technological integration, and agricultural excellence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-brand-gray-50 border-t border-brand-gray-200">
        <div className="container-main">
          <SectionHeader
            label="Why Choose Us"
            title="Our Core Values"
            description="The principles that guide everything we do."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Bird className="w-8 h-8" />,
                title: 'Quality First',
                description: 'We never compromise on the health and genetics of our birds or the nutritional value of our feed.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Farmer Success',
                description: 'Your success is our success. We provide continuous support, training, and resources to help you grow.',
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Trust & Integrity',
                description: 'We operate with transparency, keeping our promises and building long-lasting partnerships.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center p-6 bg-white rounded-xl shadow-sm border border-brand-gray-100 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-cyan-dim text-brand-cyan-dark mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-gray-900 mb-3">{value.title}</h3>
                <p className="text-brand-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-cyan-dark text-white">
        <div className="container-main max-w-3xl cta-section">
          <h2 className="mb-6">Grow With Us</h2>
          <p className="text-white/90 text-lg mb-10">
            Ready to partner with a poultry enterprise that puts your success first?
          </p>
          <div className="cta-buttons">
            <Link href="/services">
              <Button variant="light" size="lg" className="rounded-full">Explore Our Services</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline-light" size="lg" className="rounded-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


