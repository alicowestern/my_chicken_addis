import { SectionHeader } from '@/components/ui/index'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { Wheat, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Poultry Feed',
  description: 'Scientifically formulated starter, grower, and finisher feed for optimal poultry health and growth.',
}

export default function FeedPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="Premium Nutrition"
              title="Scientifically Formulated Feed"
              description="Our feed is specifically designed to meet the precise nutritional needs of your birds at every stage of their 45-day growth cycle."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Starter Feed',
                stage: 'Days 1-14',
                description: 'High protein content to support rapid early skeletal and organ development.',
                features: ['High Protein (22-24%)', 'Easy to digest', 'Immunity boosters'],
              },
              {
                title: 'Grower Feed',
                stage: 'Days 15-28',
                description: 'Balanced nutrition focused on muscle development and sustained growth.',
                features: ['Balanced Protein (20%)', 'Optimal energy levels', 'Bone strength support'],
              },
              {
                title: 'Finisher Feed',
                stage: 'Days 29-45',
                description: 'High energy formulation for final weight gain and meat quality.',
                features: ['High Energy', 'Lower Protein (18%)', 'Meat quality enhancers'],
              },
            ].map((feed) => (
              <Card key={feed.title} hover className="flex flex-col bg-brand-surface border-[rgba(255,255,255,0.05)] p-8">
                <div className="w-14 h-14 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-6">
                  <Wheat className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-brand-white mb-2">{feed.title}</h3>
                <p className="text-brand-cyan font-bold tracking-widest text-sm uppercase mb-4">{feed.stage}</p>
                <p className="text-brand-light-gray leading-relaxed mb-8 flex-grow">{feed.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {feed.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-brand-muted">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="w-full">
                  <Button variant="secondary" className="w-full rounded-full">Order {feed.title}</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}


