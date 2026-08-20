import { SectionHeader } from '@/components/ui/index'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { Landmark } from 'lucide-react'
import FinancingForm from './FinancingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financing Access',
  description: 'Access financing opportunities for your poultry farm through our partnership with Life Saving Credit.',
}

export default function FinancingPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="Financial Growth"
            title="Access to Financing"
            description="We connect dedicated farmers with the capital they need to start or expand their poultry business."
          />
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-brand-surface border-[rgba(255,255,255,0.05)] p-10 mb-12">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 flex-shrink-0 bg-brand-dark rounded-2xl flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                  <Landmark className="w-10 h-10 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-white mb-3">Our Financing Partner</h3>
                  <p className="text-brand-light-gray leading-relaxed mb-4">
                    My Chicken Addis has partnered with <strong>Life Saving Credit</strong> to help our farmers access essential financing. Whether you are building new housing, purchasing equipment, or increasing your bird capacity, financing options are available.
                  </p>
                  <div className="bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.2)] p-4 rounded-lg">
                    <p className="text-sm text-brand-cyan">
                      <strong>Disclaimer:</strong> My Chicken Addis does not directly issue loans. All financing is subject to approval by Life Saving Credit based on their lending criteria.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <h3 className="text-2xl font-bold text-brand-white mb-8 text-center">How to Apply</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { step: '01', title: 'Consultation', desc: 'Discuss your farm plan and capital needs with our advisory team.' },
                { step: '02', title: 'Documentation', desc: 'Prepare your business plan, identification, and farm records.' },
                { step: '03', title: 'Connection', desc: 'We introduce you to Life Saving Credit for formal loan processing.' },
              ].map((process) => (
                <div key={process.step} className="bg-brand-surface p-6 rounded-xl border border-[rgba(255,255,255,0.05)] text-center">
                  <div className="text-3xl font-heading font-bold text-brand-cyan mb-4">{process.step}</div>
                  <h4 className="text-lg font-bold text-brand-white mb-2">{process.title}</h4>
                  <p className="text-sm text-brand-muted">{process.desc}</p>
                </div>
              ))}
            </div>

            {/* Application Form */}
            <div className="bg-brand-surface rounded-2xl p-8 border border-[rgba(255,255,255,0.05)] shadow-card">
              <h3 className="text-2xl font-bold font-heading text-brand-white mb-2">Apply for Financing</h3>
              <p className="text-brand-muted text-sm mb-8">Fill out the form below and our team will review your application.</p>
              <FinancingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
