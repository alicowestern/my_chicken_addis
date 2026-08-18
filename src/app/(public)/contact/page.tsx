import { SectionHeader } from '@/components/ui/index'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with My Chicken Addis — call, WhatsApp, email, or visit us in Addis Ababa, Ethiopia.',
}

export default function ContactPage() {
  return (
    <>
      <section className="relative py-16 bg-brand-dark-deep overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        <div className="container-main relative z-10 flex flex-col items-center text-center">
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

      <section className="section-padding bg-brand-dark">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-brand-surface rounded-2xl p-8 border border-[rgba(255,255,255,0.05)] shadow-card">
              <h3 className="text-2xl font-bold font-heading text-brand-white mb-6">Send Us a Message</h3>
              <form className="space-y-5">
                <Input label="Full Name" placeholder="Your full name" required />
                <Input label="Phone" type="tel" placeholder="+251..." required />
                <Input label="Email" type="email" placeholder="your@email.com" />
                <Input label="Subject" placeholder="How can we help?" />
                <div>
                  <label className="block text-sm font-medium text-brand-light-gray mb-1.5">
                    Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us more..."
                    required
                    className="w-full rounded-md border bg-brand-dark px-4 py-3 text-base text-brand-white placeholder:text-brand-gray transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-cyan-dim focus:border-brand-cyan border-brand-gray hover:border-brand-light-gray"
                  />
                </div>
                <Button type="submit" size="lg" fullWidth className="rounded-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-10 lg:pl-8 pt-4">
              <div>
                <h3 className="text-2xl font-bold font-heading text-brand-white mb-8">Contact Information</h3>
                <div className="space-y-8">
                  <a href="tel:[COMPANY_PHONE]" className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-cyan/20 transition-colors">
                      <Phone className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-white mb-1">Phone</p>
                      <p className="text-sm text-brand-muted">[COMPANY PHONE]</p>
                    </div>
                  </a>

                  <a href="https://wa.me/[WHATSAPP_NUMBER]" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-cyan/20 transition-colors">
                      <MessageCircle className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-white mb-1">WhatsApp</p>
                      <p className="text-sm text-brand-muted">Chat with us anytime</p>
                    </div>
                  </a>

                  <a href="mailto:[COMPANY_EMAIL]" className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-cyan/20 transition-colors">
                      <Mail className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-white mb-1">Email</p>
                      <p className="text-sm text-brand-muted">[COMPANY EMAIL]</p>
                    </div>
                  </a>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-white mb-1">Address</p>
                      <p className="text-sm text-brand-muted">Addis Ababa, Ethiopia</p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-full border border-brand-cyan bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-white mb-1">Business Hours</p>
                      <p className="text-sm text-brand-muted">Monday – Saturday: 8:00 AM – 6:00 PM</p>
                      <p className="text-sm text-brand-muted">Sunday: Closed</p>
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



