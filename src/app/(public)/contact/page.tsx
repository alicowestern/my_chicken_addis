import { SectionHeader } from '@/components/ui/index'
import ContactForm from '@/components/public/ContactForm'
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with My Chicken Addis — call, WhatsApp, email, or visit us in Addis Ababa, Ethiopia.',
}

export default function ContactPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-bg overflow-hidden border-b border-brand-gray-200">
        <div className="container-main relative z-10 page-hero">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              as="h1"
            label="Contact"
            title="Get in Touch"
            description="Have a question or need help? We're here for you."
          />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-brand-gray-200 shadow-card">
              <h3 className="text-2xl font-bold font-heading text-brand-gray-900 mb-6">Send Us a Message</h3>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-10 lg:pl-8 pt-4">
              <div>
                <h3 className="text-2xl font-bold font-heading text-brand-gray-900 mb-8">Contact Information</h3>
                <div className="space-y-8">
                  <a href="tel:[COMPANY_PHONE]" className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-cyan/20 transition-colors">
                      <Phone className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-gray-900 mb-1">Phone</p>
                      <p className="text-sm text-brand-gray-500">[COMPANY PHONE]</p>
                    </div>
                  </a>

                  <a href="https://wa.me/[WHATSAPP_NUMBER]" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-cyan/20 transition-colors">
                      <MessageCircle className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-gray-900 mb-1">WhatsApp</p>
                      <p className="text-sm text-brand-gray-500">Chat with us anytime</p>
                    </div>
                  </a>

                  <a href="mailto:[COMPANY_EMAIL]" className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-cyan/20 transition-colors">
                      <Mail className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-gray-900 mb-1">Email</p>
                      <p className="text-sm text-brand-gray-500">[COMPANY EMAIL]</p>
                    </div>
                  </a>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-gray-900 mb-1">Address</p>
                      <p className="text-sm text-brand-gray-500">Addis Ababa, Ethiopia</p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-gray-900 mb-1">Business Hours</p>
                      <p className="text-sm text-brand-gray-500">Monday – Saturday: 8:00 AM – 6:00 PM</p>
                      <p className="text-sm text-brand-gray-500">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
