import Link from 'next/link'
import Image from 'next/image'
import { Bird, Wheat, GraduationCap, Landmark, ArrowRight, Users, Award, TrendingUp, ShieldCheck, Calendar, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getAvailableBirdProducts, getPublishedBlogPosts, getUpcomingEvents } from '@/lib/actions/public'

// Core services
const services = [
  {
    icon: <Bird className="w-8 h-8" />,
    title: '45-Day Birds',
    description: 'Healthy, quality birds prepared for productive poultry farming.',
    href: '/birds',
    cta: 'Explore Birds'
  },
  {
    icon: <Wheat className="w-8 h-8" />,
    title: 'Poultry Feed',
    description: 'Quality feed solutions designed to support healthy growth and productivity.',
    href: '/feed',
    cta: 'Explore Feed'
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Farmer Training',
    description: 'Practical poultry education covering farming, feeding, management and business.',
    href: '/training',
    cta: 'View Training'
  },
  {
    icon: <Landmark className="w-8 h-8" />,
    title: 'Financing Support',
    description: 'Access financing opportunities that can help farmers start or expand their poultry businesses.',
    href: '/financing',
    cta: 'Learn About Financing'
  },
]

export default async function HomePage() {
  // Fetch dynamic content
  const [birdsResult, postsResult, eventsResult] = await Promise.all([
    getAvailableBirdProducts(),
    getPublishedBlogPosts(1, 3),
    getUpcomingEvents()
  ])

  const birds = birdsResult.success ? birdsResult.data.slice(0, 3) : []
  const posts = postsResult.success ? postsResult.data.posts : []
  const upcomingEvent = eventsResult.success && eventsResult.data.length > 0 ? eventsResult.data[0] : null

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-brand-bg overflow-hidden py-20 lg:py-0 border-b border-brand-gray-200">
        <div className="absolute inset-0 z-0 lg:w-1/2 lg:right-0 lg:left-auto opacity-20 lg:opacity-100">
          <Image 
            src="/Images/img1.webp"
            alt="Healthy poultry farm"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent hidden lg:block" />
        </div>
        
        <div className="container-main relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-brand-cyan-dark font-bold tracking-widest text-sm uppercase mb-4 sm:mb-6 animate-fade-up">
              My Chicken Addis
            </p>
            <h1 className="mb-6 leading-tight text-brand-gray-900 animate-fade-up stagger-1">
              Grow Better.<br className="hidden lg:block"/>
              Farm Smarter.<br className="hidden lg:block"/>
              <span className="text-brand-cyan-dark block lg:inline">Earn More.</span>
            </h1>
            <p className="text-lg sm:text-xl text-brand-gray-600 mb-10 leading-relaxed font-light mx-auto lg:mx-0 max-w-xl animate-fade-up stagger-2">
              Quality poultry, practical training, feed and financing support to help farmers build successful poultry businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-up stagger-3">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" fullWidth className="sm:!w-auto px-8 rounded-full">
                  Get Started
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth className="sm:!w-auto px-8 rounded-full">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / QUICK STATS SECTION */}
      <section className="bg-white border-b border-brand-gray-200">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 lg:py-16">
            <div className="text-center px-4 border-r-0 sm:border-r border-brand-gray-200">
              <p className="text-3xl lg:text-4xl font-bold text-brand-cyan-dark font-heading mb-2">45 Days</p>
              <p className="text-sm font-semibold text-brand-gray-900 mb-1">Quality bird cycle</p>
              <p className="text-sm text-brand-gray-600 hidden sm:block">Optimized for fast growth</p>
            </div>
            <div className="text-center px-4 lg:border-r border-brand-gray-200">
              <p className="text-3xl lg:text-4xl font-bold text-brand-cyan-dark font-heading mb-2">Farmer Focused</p>
              <p className="text-sm font-semibold text-brand-gray-900 mb-1">Built around farmers</p>
              <p className="text-sm text-brand-gray-600 hidden sm:block">Your success is our priority</p>
            </div>
            <div className="text-center px-4 border-r-0 sm:border-r border-brand-gray-200">
              <p className="text-3xl lg:text-4xl font-bold text-brand-cyan-dark font-heading mb-2">4 Services</p>
              <p className="text-sm font-semibold text-brand-gray-900 mb-1">One ecosystem</p>
              <p className="text-sm text-brand-gray-600 hidden sm:block">Everything in one place</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl lg:text-4xl font-bold text-brand-cyan-dark font-heading mb-2">Community</p>
              <p className="text-sm font-semibold text-brand-gray-900 mb-1">Growing together</p>
              <p className="text-sm text-brand-gray-600 hidden sm:block">Supporting entrepreneurs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="section-padding bg-brand-gray-50">
        <div className="container-main">
          <div className="section-header">
            <h2>Everything You Need to Grow</h2>
            <p>
              From quality birds to practical knowledge and financing support, My Chicken Addis helps farmers move from starting a poultry business to growing it successfully.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={service.title} href={service.href} className="group">
                <Card hover className="h-full p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-brand-cyan-dim text-brand-cyan-dark flex items-center justify-center mb-6 group-hover:bg-brand-cyan-dark group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                  <p className="text-xs font-bold text-brand-gray-400 tracking-wider mb-2">0{index + 1}</p>
                  <h3 className="text-xl font-bold text-brand-gray-900 mb-3 group-hover:text-brand-cyan-dark transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-brand-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-brand-cyan-dark">
                    {service.cta} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED BIRDS SECTION */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="split-section">
            <div className="lg:w-1/3 split-text">
              <h2 className="mb-6">Quality Birds.<br/>Better Farming.</h2>
              <p className="subheading mb-8">
                Our broilers are healthy, carefully managed, and ready for your next production cycle. Achieve market weight efficiently.
              </p>
              <Link href="/birds">
                <Button size="lg" className="rounded-full">View All Birds</Button>
              </Link>
            </div>
            
            <div className="lg:w-2/3 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {birds.length > 0 ? birds.map((bird) => (
                  <Card key={bird.id} className="overflow-hidden group cursor-pointer" padding="none" hover>
                    <div className="relative h-48 w-full overflow-hidden bg-brand-gray-100">
                      <Image 
                        src={bird.image || '/Images/img1.webp'} 
                        alt={bird.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-brand-gray-900 mb-2">{bird.name}</h4>
                      <p className="text-sm text-brand-gray-600 mb-4 line-clamp-2">{bird.description}</p>
                      <span className="text-brand-cyan-dark font-semibold text-sm flex items-center">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Card>
                )) : (
                  <Card className="overflow-hidden group p-6 sm:col-span-2">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-brand-gray-100 flex items-center justify-center text-brand-gray-400">
                        <Bird className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-gray-900 mb-2">45-Day Birds</h4>
                        <p className="text-sm text-brand-gray-600 mb-4">Healthy, carefully managed birds ready for your next production cycle.</p>
                        <span className="text-brand-cyan-dark font-semibold text-sm flex items-center">
                          View Details <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY MY CHICKEN ADDIS */}
      <section className="section-padding bg-brand-gray-50 relative overflow-hidden border-y border-brand-gray-200">
        <div className="absolute inset-0 opacity-30 bg-pattern" />
        <div className="container-main relative z-10">
          <div className="section-header">
            <h2>Why Farmers Choose Us</h2>
            <p>
              We provide a complete support system designed specifically for your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Quality First', desc: 'We focus on reliable poultry products and services.', icon: <Award className="w-8 h-8" /> },
              { title: 'Practical Knowledge', desc: 'Training designed around real poultry farming challenges.', icon: <GraduationCap className="w-8 h-8" /> },
              { title: 'Complete Support', desc: 'Birds, feed, training and financing support in one place.', icon: <ShieldCheck className="w-8 h-8" /> },
              { title: 'Farmer First', desc: 'Our services are designed to help farmers build sustainable businesses.', icon: <Users className="w-8 h-8" /> },
            ].map((benefit) => (
              <Card key={benefit.title} hover className="p-8 text-center flex flex-col items-center bg-white border border-brand-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan-dim flex items-center justify-center text-brand-cyan-dark mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-brand-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FARMING JOURNEY */}
      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <h2 className="mb-16">From Idea to Poultry Business</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative max-w-5xl mx-auto">
            {/* Connecting Line Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-gray-200 -z-10 -translate-y-1/2" />
            
            {[
              { step: '01', title: 'Plan', desc: 'Business setup' },
              { step: '02', title: 'Get Your Birds', desc: '45-day chicks' },
              { step: '03', title: 'Feed & Manage', desc: 'Quality nutrition' },
              { step: '04', title: 'Grow', desc: 'Expert support' },
              { step: '05', title: 'Sell & Earn', desc: 'Market success' },
            ].map((phase, idx) => (
              <div key={phase.step} className="flex flex-col items-center bg-white px-4 relative mb-12 md:mb-0 w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-brand-cyan-dim text-brand-cyan-dark flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm z-10">
                  {phase.step}
                </div>
                <h4 className="font-bold text-brand-gray-900 mb-1">{phase.title}</h4>
                <p className="text-xs text-brand-gray-500 uppercase tracking-wider">{phase.desc}</p>
                {/* Connecting Line Mobile */}
                {idx !== 4 && <div className="md:hidden w-0.5 h-12 bg-brand-gray-200 absolute -bottom-12 z-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRAINING SECTION */}
      <section className="section-padding bg-brand-gray-50 border-y border-brand-gray-200">
        <div className="container-main">
          <div className="split-section">
            <div className="lg:w-1/2 w-full">
              <div className="split-image shadow-lg">
                <Image 
                  src="/Images/img2.png"
                  alt="Farmer training session"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2 split-text">
              <h2 className="mb-6">Learn. Apply. Grow.</h2>
              <p className="subheading mb-8">
                Practical poultry training designed to give farmers the knowledge and confidence to manage their farms successfully.
              </p>
              
              <ul className="space-y-4 mb-10 text-left">
                {['Farm Setup & Management', 'Feeding & Nutrition', 'Biosecurity & Disease Prevention', 'Business & Financial Planning'].map((item) => (
                  <li key={item} className="flex items-center text-brand-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-success mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/training">
                  <Button size="lg" className="rounded-full">Explore Training</Button>
                </Link>
                <Link href="/events">
                  <Button size="lg" variant="secondary" className="rounded-full">Upcoming Events</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINANCING CTA */}
      <section className="py-20 bg-brand-cyan-dark text-white">
        <div className="container-main max-w-3xl cta-section">
          <h2 className="mb-6">Ready to Start or Expand Your Poultry Business?</h2>
          <p className="text-white/90 text-lg mb-10">
            Explore financing opportunities designed to help farmers take the next step. 
            We partner with institutions to provide Life Saving Credit and other support.
          </p>
          <Link href="/financing">
            <Button variant="light" size="lg" className="rounded-full">
              Explore Financing <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 9. UPCOMING EVENT (Dynamic) */}
      {upcomingEvent && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-center">Upcoming Event</h2>
            </div>
            
            <Card padding="none" className="max-w-4xl mx-auto overflow-hidden flex flex-col md:flex-row group">
              <div className="md:w-2/5 relative min-h-[250px]">
                <Image 
                  src={upcomingEvent.featuredImage || "/Images/img1.webp"}
                  alt={upcomingEvent.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-center items-center text-center md:items-start md:text-left">
                <div className="flex gap-4 mb-4">
                  <span className="flex items-center text-sm text-brand-gray-600">
                    <Calendar className="w-4 h-4 mr-1 text-brand-cyan-dark" />
                    {new Date(upcomingEvent.date).toLocaleDateString()}
                  </span>
                  {upcomingEvent.location && (
                    <span className="flex items-center text-sm text-brand-gray-600">
                      <MapPin className="w-4 h-4 mr-1 text-brand-cyan-dark" />
                      {upcomingEvent.location}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-brand-gray-900 mb-3">{upcomingEvent.title}</h3>
                <p className="text-brand-gray-600 mb-8 line-clamp-3">{upcomingEvent.description}</p>
                <div>
                  <Link href={`/events/${upcomingEvent.id}`}>
                    <Button>Register Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* 10. BLOG / NEWS */}
      <section className="section-padding bg-brand-gray-50 border-t border-brand-gray-200">
        <div className="container-main">
          <div className="section-header">
            <h2>From My Chicken Addis</h2>
            <p>
              News, farmer stories, events and practical poultry knowledge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {posts.length > 0 ? posts.map((post) => (
              <Card key={post.id} padding="none" hover className="overflow-hidden flex flex-col bg-white">
                <div className="relative h-56 w-full">
                  <Image 
                    src={post.featuredImage || "/Images/img2.png"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-white text-brand-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {post.category.name}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-xl text-brand-gray-900 mb-3 line-clamp-2">{post.title}</h4>
                  <p className="text-brand-gray-600 text-sm mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-brand-gray-100">
                    <span className="text-xs text-brand-gray-500">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-brand-cyan-dark flex items-center hover:text-brand-cyan transition-colors">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-10 text-brand-gray-500">
                Check back soon for the latest news and farmer stories!
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link href="/blog">
              <Button variant="secondary" className="rounded-full">View All News & Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FARMER STORY */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="split-section bg-brand-gray-50 rounded-3xl overflow-hidden shadow-sm">
            <div className="lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-[600px] w-full">
              <Image 
                src="/Images/img1.webp"
                alt="Ethiopian Poultry Farmer"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:w-1/2 p-8 sm:p-10 lg:p-16 split-text">
              <p className="text-sm font-bold text-brand-cyan-dark tracking-widest uppercase mb-4">Farmer Story</p>
              <h2 className="mb-6">Growing a Poultry Business with My Chicken Addis</h2>
              <p className="text-brand-gray-600 text-lg leading-relaxed mb-8">
                "Starting with just a few 45-day birds and proper training, I was able to scale my farm sustainably. The practical support and quality feed made all the difference in my yields."
              </p>
              <Link href="/blog">
                <Button className="rounded-full">Read the Story <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="section-padding bg-brand-cyan-dark text-white">
        <div className="container-main max-w-3xl cta-section">
          <h2 className="mb-6">Let's Build Your Poultry Business</h2>
          <p className="text-white/90 text-lg mb-10">
            Whether you are starting your first poultry farm or looking to grow an existing one, My Chicken Addis is here to support you.
          </p>
          <div className="cta-buttons">
            <Link href="/birds">
              <Button variant="light" size="lg" className="rounded-full">Get Started</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline-light" size="lg" className="rounded-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
