import { SectionHeader } from '@/components/ui/index'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Farmer Training',
  description: 'Practical, hands-on poultry training programs for beginners and experienced farmers in Ethiopia.',
}

export default function TrainingPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
              label="Knowledge & Empowerment"
              title="Farmer Training Programs"
              description="Gain the practical skills and theoretical knowledge required to run a highly profitable poultry business."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-brand-surface p-10 border-[rgba(255,255,255,0.05)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-brand-white mb-4">Poultry Farming Basics</h3>
                <p className="text-brand-light-gray leading-relaxed mb-8">
                  Perfect for beginners and youth entrepreneurs. Learn the fundamentals of setting up a farm, biosecurity basics, brooding management, and standard feeding practices.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center text-sm text-brand-muted"><Calendar className="w-4 h-4 mr-3 text-brand-cyan" /> 2-Day Intensive Course</div>
                  <div className="flex items-center text-sm text-brand-muted"><MapPin className="w-4 h-4 mr-3 text-brand-cyan" /> Addis Ababa Training Center</div>
                </div>
              </div>
              <Link href="/contact">
                <Button className="w-full rounded-full">Register Interest</Button>
              </Link>
            </Card>

            <Card className="bg-brand-surface p-10 border-[rgba(255,255,255,0.05)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-brand-white mb-4">Advanced Farm Management</h3>
                <p className="text-brand-light-gray leading-relaxed mb-8">
                  Designed for existing farmers looking to scale. Covers advanced disease control, feed conversion optimization, financial planning, and business growth strategies.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center text-sm text-brand-muted"><Calendar className="w-4 h-4 mr-3 text-brand-cyan" /> 3-Day Advanced Workshop</div>
                  <div className="flex items-center text-sm text-brand-muted"><MapPin className="w-4 h-4 mr-3 text-brand-cyan" /> Addis Ababa Training Center</div>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="secondary" className="w-full rounded-full">Register Interest</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}


