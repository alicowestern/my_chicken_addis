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
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(79,195,247,0.05)_0%,transparent_70%)]" />
        </div>
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-6 text-center"><span className="text-gradient-brand">About Us</span></h1>
            <p className="text-xl text-brand-light-gray leading-relaxed font-light text-center">
              We are an Ethiopian poultry enterprise dedicated to transforming the agricultural sector by empowering farmers with quality birds, premium feed, expert knowledge, and growth opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <Card hover className="bg-brand-surface p-10 border-[rgba(255,255,255,0.05)] hover:border-brand-cyan/40">
              <div className="w-16 h-16 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-8">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-3xl mb-4 font-heading text-brand-white text-center">Our Mission</h2>
              <p className="text-brand-light-gray leading-relaxed">
                To build a sustainable and highly productive poultry ecosystem in Ethiopia by providing farmers with reliable access to 45-day birds, scientifically formulated feed, and comprehensive support services.
              </p>
            </Card>

            <Card hover className="bg-brand-surface p-10 border-[rgba(255,255,255,0.05)] hover:border-brand-cyan/40">
              <div className="w-16 h-16 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-8">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl mb-4 font-heading text-brand-white text-center">Our Vision</h2>
              <p className="text-brand-light-gray leading-relaxed">
                To become the most trusted poultry partner in East Africa, recognized for our commitment to farmer success, technological integration, and agricultural excellence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-brand-dark-deep border-t border-[rgba(255,255,255,0.05)]">
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
              <div key={value.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-surface border border-[rgba(255,255,255,0.1)] text-brand-cyan mb-6 shadow-glow">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-white mb-3">{value.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-dark text-center border-t border-[rgba(255,255,255,0.05)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,195,247,0.08)_0%,transparent_60%)]" />
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <h2 className="mb-6 max-w-2xl text-center">Grow With Us</h2>
          <p className="text-brand-light-gray text-lg mb-10 max-w-xl text-center">
            Ready to partner with a poultry enterprise that puts your success first?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services">
              <Button size="lg" className="rounded-full">Explore Our Services</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="rounded-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


