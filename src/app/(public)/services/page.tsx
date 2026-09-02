import { SectionHeader } from '@/components/ui/index'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { Bird, Wheat, GraduationCap, Landmark, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore the core services of My Chicken Addis: 45-Day Birds, Poultry Feed, Farmer Training, and Financing Access.',
}

const coreServices = [
  {
    id: 'birds',
    title: '45-Day Birds',
    description: 'High-quality broiler chicks bred for optimal growth and health, ready for market in just 45 days. We provide strong, disease-resistant birds to maximize your farm\'s profitability.',
    icon: <Bird className="w-8 h-8" />,
    href: '/birds',
    features: ['High livability', 'Fast growth rate', 'Vaccinated chicks'],
  },
  {
    id: 'feed',
    title: 'Poultry Feed',
    description: 'Scientifically formulated feed for every stage of your flock\'s development. From starter to finisher, our feed ensures maximum nutritional absorption and weight gain.',
    icon: <Wheat className="w-8 h-8" />,
    href: '/feed',
    features: ['Starter Feed', 'Grower Feed', 'Finisher Feed'],
  },
  {
    id: 'training',
    title: 'Farmer Training',
    description: 'Practical, hands-on training programs designed for both beginners and experienced farmers. Learn best practices in farm management, biosecurity, and business planning.',
    icon: <GraduationCap className="w-8 h-8" />,
    href: '/training',
    features: ['Farm Setup', 'Disease Prevention', 'Business Management'],
  },
  {
    id: 'financing',
    title: 'Financing Access',
    description: 'We connect dedicated farmers with financing opportunities through our partners, helping you access the capital needed to start or expand your poultry business.',
    icon: <Landmark className="w-8 h-8" />,
    href: '/financing',
    features: ['Partner Network', 'Expansion Support', 'Clear Guidance'],
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="relative py-20 lg:py-24 bg-brand-gray-50 overflow-hidden border-b border-brand-gray-200">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-pattern opacity-30" />
        </div>
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-cyan-dark font-bold tracking-widest text-sm uppercase mb-4">Our Ecosystem</p>
            <h1 className="mb-6">A Complete Ecosystem for Poultry Success</h1>
            <p className="text-lg sm:text-xl text-brand-gray-600 leading-relaxed font-light">
              Everything you need to run a profitable poultry farm, provided by a single trusted partner.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {coreServices.map((service) => (
              <Card key={service.id} hover className="p-8 lg:p-10 bg-brand-gray-50 border-brand-gray-200 group">
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-brand-cyan-dim flex items-center justify-center text-brand-cyan-dark mb-8 transition-colors duration-300 group-hover:bg-brand-cyan-dark group-hover:text-white">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-gray-900 mb-4 group-hover:text-brand-cyan-dark transition-colors">{service.title}</h3>
                  <p className="text-brand-gray-600 leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-brand-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan-dark mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={service.href}>
                    <Button variant="secondary" className="w-full sm:w-auto rounded-full group-hover:border-brand-cyan-dark group-hover:text-brand-cyan-dark">
                      Explore {service.title} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-cyan-dark text-white">
        <div className="container-main max-w-3xl cta-section">
          <h2 className="mb-6">Ready to Start?</h2>
          <p className="text-white/90 text-lg mb-10">
            Contact us today to discuss your farming needs and how our services can help you grow.
          </p>
          <div className="cta-buttons">
            <Link href="/contact">
              <Button variant="light" size="lg" className="rounded-full">Talk to Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}



