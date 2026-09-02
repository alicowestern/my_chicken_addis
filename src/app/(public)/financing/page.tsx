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
      <section className="relative py-16 bg-brand-bg overflow-hidden border-b border-brand-gray-200">
        <div className="container-main relative z-10 page-hero">
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

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white border-brand-gray-200 p-10 mb-12">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center border border-brand-gray-200">
                  <Landmark className="w-10 h-10 text-brand-cyan" />
                </div>
                <div className="page-hero md:items-start md:text-left">
                  <h3 className="text-2xl font-bold text-brand-gray-900 mb-3">Our Financing Partner</h3>
                  <p className="text-brand-gray-600 leading-relaxed mb-4">
                    My Chicken Addis has partnered with <strong>Life Saving Credit</strong> to help our farmers access essential financing. Whether you are building new housing, purchasing equipment, or increasing your bird capacity, financing options are available.
                  </p>
                  <div className="bg-brand-cyan-dim border border-brand-cyan/20 p-4 rounded-lg">
                    <p className="text-sm text-brand-cyan">
                      <strong>Disclaimer:</strong> My Chicken Addis does not directly issue loans. All financing is subject to approval by Life Saving Credit based on their lending criteria.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <h3 className="text-2xl font-bold text-brand-gray-900 mb-8 text-center">How to Apply</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { step: '01', title: 'Consultation', desc: 'Discuss your farm plan and capital needs with our advisory team.' },
                { step: '02', title: 'Documentation', desc: 'Prepare your business plan, identification, and farm records.' },
                { step: '03', title: 'Connection', desc: 'We introduce you to Life Saving Credit for formal loan processing.' },
              ].map((process) => (
                <div key={process.step} className="bg-white p-6 rounded-xl border border-brand-gray-200 text-center">
                  <div className="text-3xl font-heading font-bold text-brand-cyan mb-4">{process.step}</div>
                  <h4 className="text-lg font-bold text-brand-gray-900 mb-2">{process.title}</h4>
                  <p className="text-sm text-brand-gray-500">{process.desc}</p>
                </div>
              ))}
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-2xl p-8 border border-brand-gray-200 shadow-card">
              <h3 className="text-2xl font-bold font-heading text-brand-gray-900 mb-2">Apply for Financing</h3>
              <p className="text-brand-gray-500 text-sm mb-8">Fill out the form below and our team will review your application.</p>
              <FinancingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
