import React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle, Globe } from 'lucide-react'

const services = [
  { name: '45-Day Birds', href: '/birds' },
  { name: 'Poultry Feed', href: '/feed' },
  { name: 'Farmer Training', href: '/training' },
  { name: 'Financing', href: '/financing' },
]

const company = [
  { name: 'About Us', href: '/about' },
  { name: 'News & Events', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-dark-deep pt-20 pb-10 border-t border-[rgba(255,255,255,0.05)]">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="block text-2xl font-bold text-brand-white font-heading leading-none">
                my chicken
              </span>
              <span className="block text-sm font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none">
                addis
              </span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              Helping farmers start and grow successful poultry businesses with
              quality birds, feed, training, and access to financing opportunities.
            </p>
            <p className="text-brand-cyan font-bold tracking-widest text-sm uppercase">
              GROW TOGETHER
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-brand-white font-bold text-sm uppercase tracking-wider mb-6">
              Services
            </h3>
            <ul className="space-y-4">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-gray hover:text-brand-cyan transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-brand-white font-bold text-sm uppercase tracking-wider mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-gray hover:text-brand-cyan transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-white font-bold text-sm uppercase tracking-wider mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:[COMPANY_PHONE]"
                  className="flex items-start gap-3 text-sm text-brand-gray hover:text-brand-cyan transition-colors duration-300 group"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>[COMPANY PHONE]</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/[WHATSAPP_NUMBER]"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-brand-gray hover:text-brand-cyan transition-colors duration-300 group"
                >
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:[COMPANY_EMAIL]"
                  className="flex items-start gap-3 text-sm text-brand-gray hover:text-brand-cyan transition-colors duration-300 group"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>[COMPANY EMAIL]</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-brand-gray">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-brand-gray">
            © {new Date().getFullYear()} My Chicken Addis. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-brand-gray flex items-center justify-center text-brand-light-gray hover:border-brand-cyan hover:text-brand-cyan transition-all duration-300"
              aria-label="Social Media"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
