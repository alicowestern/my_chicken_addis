import Link from 'next/link'
import Image from 'next/image'
import { Bird, Wheat, GraduationCap, Landmark, ArrowRight, Users, Award, TrendingUp, ShieldCheck } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import HeroBackgroundSlider from '@/components/ui/HeroBackgroundSlider'

const services = [
  {
    icon: <Bird className="w-6 h-6" />,
    title: '45-Day Birds',
    description: 'Quality broiler chickens raised with optimal genetics, ready for market in 45 days.',
    href: '/birds',
  },
  {
    icon: <Wheat className="w-6 h-6" />,
    title: 'Poultry Feed',
    description: 'Starter, grower, and finisher feeds scientifically formulated for maximum growth.',
    href: '/feed',
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Farmer Training',
    description: 'Practical, hands-on courses on farm setup, feeding schedules, and business management.',
    href: '/training',
  },
  {
    icon: <Landmark className="w-6 h-6" />,
    title: 'Financing',
    description: 'Access to financing opportunities through our network of trusted partners.',
    href: '/financing',
  },
]

const stats = [
  { value: '500+', label: 'Farmers Served', icon: Users },
  { value: '98%', label: 'Survival Rate', icon: ShieldCheck },
  { value: '45', label: 'Days to Market', icon: TrendingUp },
  { value: '3+', label: 'Years Experience', icon: Award },
]

export default function HomePage() {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center bg-brand-dark-deep overflow-hidden py-12 sm:py-16">
        <HeroBackgroundSlider />
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center w-full">
            <h1 className="mb-6 sm:mb-8 leading-tight w-full text-center drop-shadow-lg">
              GROW YOUR<br/>
              <span className="text-gradient-brand">POULTRY BUSINESS</span><br/>
              WITH CONFIDENCE
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand-light-gray mb-8 sm:mb-10 leading-relaxed font-light w-full text-center max-w-2xl mx-auto px-2">
              Ethiopia&apos;s premier partner for day-old chicks, high-quality feed, and expert farmer training. We provide the complete ecosystem for your success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" fullWidth className="sm:!w-auto px-8 font-semibold rounded-full shadow-[0_0_20px_rgba(79,195,247,0.3)]">
                  Explore Our Services
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth className="sm:!w-auto px-8 font-semibold rounded-full group">
                  Contact Us
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS BANNER ==================== */}
      <section className="relative -mt-8 sm:-mt-10 z-10 pb-8 sm:pb-12">
        <div className="container-main">
          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-3">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-brand-white font-heading">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-brand-muted mt-1">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4">Our Services</p>
            <h2 className="mb-6 text-center">Everything You Need for Poultry Farming</h2>
            <p className="subheading max-w-2xl mx-auto px-4 text-center">
              From quality birds and feed to practical training and financing support, we provide a complete ecosystem for farmers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service) => (
              <Link key={service.title} href={service.href} className="group">
                <Card hover className="h-full p-6 sm:p-8 flex flex-col items-start bg-brand-surface border-[rgba(255,255,255,0.05)] hover:border-[rgba(79,195,247,0.4)] transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[rgba(79,195,247,0.3)] bg-[rgba(79,195,247,0.05)] text-brand-cyan flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-brand-white mb-3 sm:mb-4">
                    {service.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-6 sm:mb-8 flex-grow">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan group-hover:text-brand-blue transition-colors">
                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4">Our Birds</p>
              <h2 className="mb-6 text-left">Quality 45-Day Birds</h2>
              <p className="text-brand-light-gray text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                Our birds are healthy, well-bred broilers that reach market weight in just 45 days. Backed by our quality feed and ongoing farmer support, you can raise them with confidence.
              </p>
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {[
                  'Optimal growth genetics',
                  'High livability rate',
                  'Supported by expert training',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 sm:gap-4 text-brand-white text-sm sm:text-base">
                    <span className="w-6 h-6 rounded-full bg-[rgba(79,195,247,0.1)] flex items-center justify-center text-brand-cyan border border-[rgba(79,195,247,0.2)] flex-shrink-0 text-xs">
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
                <Image 
                  src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop" 
                  alt="Healthy poultry farm with quality broiler chickens" 
                  width={1000}
                  height={600}
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                  priority={false}
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
        <div className="container-main relative z-10 flex flex-col items-center text-center px-4">
          <h2 className="mb-6 max-w-3xl text-center">
            Ready to Start Your Poultry Journey?
          </h2>
          <p className="text-brand-light-gray text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl text-center">
            Whether you&apos;re a first-time farmer or looking to expand, we&apos;re here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 w-full sm:w-auto">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="sm:!w-auto px-8 rounded-full">
                Contact Us Today
              </Button>
            </Link>
            <Link href="/for-farmers" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth className="sm:!w-auto px-8 rounded-full">
                For Farmers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
