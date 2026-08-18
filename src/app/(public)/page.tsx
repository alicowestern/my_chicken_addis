import Link from 'next/link'
import { Bird, Wheat, GraduationCap, Landmark, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function HomePage() {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[80vh] flex items-center bg-brand-dark-deep overflow-hidden py-16">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center w-full bg-brand-dark-deep/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="mb-8 leading-tight w-full text-center drop-shadow-lg">
              GROW YOUR<br/>
              <span className="text-gradient-brand">POULTRY BUSINESS</span><br/>
              WITH CONFIDENCE
            </h1>
            <p className="text-xl md:text-2xl text-brand-light-gray mb-10 leading-relaxed font-light w-full text-center">
              Ethiopia's premier partner for day-old chicks, high-quality feed, and expert farmer training. We provide the complete ecosystem for your success.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
              <Link href="/services">
                <Button size="lg" className="px-8 font-semibold rounded-full shadow-[0_0_20px_rgba(79,195,247,0.3)]">
                  Explore Our Services
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="px-8 font-semibold rounded-full group">
                  Contact Us
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="mb-6 text-center">Everything You Need for Poultry Farming</h2>
            <p className="subheading max-w-2xl mx-auto">
              From quality birds and feed to practical training and financing support, we provide a complete ecosystem for farmers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Bird className="w-6 h-6" />,
                title: '45-Day Birds',
                description: 'Quality broiler chickens ready for market in 45 days.',
                href: '/birds',
              },
              {
                icon: <Wheat className="w-6 h-6" />,
                title: 'Poultry Feed',
                description: 'Starter, grower, and finisher feeds for optimal growth.',
                href: '/feed',
              },
              {
                icon: <GraduationCap className="w-6 h-6" />,
                title: 'Farmer Training',
                description: 'Practical courses on farm setup, feeding, and business.',
                href: '/training',
              },
              {
                icon: <Landmark className="w-6 h-6" />,
                title: 'Financing',
                description: 'Access to financing opportunities through our partners.',
                href: '/financing',
              },
            ].map((service) => (
              <Link key={service.title} href={service.href} className="group">
                <Card hover className="h-full p-8 flex flex-col items-start bg-brand-surface border-[rgba(255,255,255,0.05)] hover:border-[rgba(79,195,247,0.4)] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full border border-[rgba(79,195,247,0.3)] bg-[rgba(79,195,247,0.05)] text-brand-cyan flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-brand-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan group-hover:text-brand-blue transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURE HIGHLIGHT ==================== */}
      <section className="section-padding bg-brand-dark-deep border-y border-[rgba(255,255,255,0.05)] relative overflow-hidden">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-center">Quality 45-Day Birds</h2>
              <p className="text-brand-light-gray text-lg leading-relaxed mb-8">
                Our birds are healthy, well-bred broilers that reach market weight in just 45 days. Backed by our quality feed and ongoing farmer support, you can raise them with confidence.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Optimal growth genetics',
                  'High livability rate',
                  'Supported by expert training',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-brand-white">
                    <span className="w-6 h-6 rounded-full bg-[rgba(79,195,247,0.1)] flex items-center justify-center text-brand-cyan border border-[rgba(79,195,247,0.2)]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/birds">
                <Button size="lg" className="rounded-full">Request Birds</Button>
              </Link>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-brand-cyan opacity-20 blur-[100px] rounded-full" />
              <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-soft">
                <img 
                  src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop" 
                  alt="Healthy poultry" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-deep via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="section-padding bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(79,195,247,0.15)_0%,transparent_50%)]" />
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <h2 className="mb-6 max-w-3xl text-center">
            Ready to Start Your Poultry Journey?
          </h2>
          <p className="text-brand-light-gray text-lg mb-10 max-w-2xl text-center">
            Whether you&apos;re a first-time farmer or looking to expand, we&apos;re here to help you succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/contact">
              <Button size="lg" className="px-8 rounded-full">
                Contact Us Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


