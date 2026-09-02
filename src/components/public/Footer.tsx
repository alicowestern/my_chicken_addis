import React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { COMPANY, SOCIAL_LINKS } from '@/lib/constants'

const services = [
  { name: '45-Day Birds', href: '/birds' },
  { name: 'Poultry Feed', href: '/feed' },
  { name: 'Farmer Training', href: '/training' },
  { name: 'Financing', href: '/financing' },
]

const company = [
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'News & Events', href: '/blog' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-gray-900 pt-16 sm:pt-20 pb-8 sm:pb-10 border-t border-brand-gray-800">
      <div className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="block text-2xl font-bold text-white font-heading leading-none">
                My Chicken
              </span>
              <span className="block text-sm font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none">
                Addis
              </span>
            </Link>
            <p className="text-brand-gray-300 text-sm leading-relaxed mb-6">
              Helping farmers start and grow successful poultry businesses with
              quality birds, feed, training, and access to financing opportunities.
            </p>
            <p className="text-brand-cyan font-bold tracking-widest text-sm uppercase">
              GROW TOGETHER
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 sm:mb-6 text-left">
              Services
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-gray-300 hover:text-brand-cyan transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 sm:mb-6 text-left">
              Company
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-gray-300 hover:text-brand-cyan transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 sm:mb-6 text-left">
              Contact Us
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-sm text-brand-gray-300 hover:text-brand-cyan transition-colors duration-200 group"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>{COMPANY.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-brand-gray-300 hover:text-brand-cyan transition-colors duration-200 group"
                >
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-start gap-3 text-sm text-brand-gray-300 hover:text-brand-cyan transition-colors duration-200 group"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>{COMPANY.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-brand-gray-300">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-cyan" />
                  <span>{COMPANY.address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-brand-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-xs text-brand-gray-400 text-center sm:text-left">
            © {currentYear} {COMPANY.name}. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs text-brand-gray-400 hover:text-brand-cyan transition-colors">
              Admin Portal
            </Link>
            
            {/* Social Links */}
            {Object.values(SOCIAL_LINKS).some(Boolean) && (
            <div className="flex gap-3">
              {SOCIAL_LINKS.telegram && (
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-brand-gray-700 flex items-center justify-center text-brand-gray-300 hover:border-brand-cyan hover:text-brand-cyan transition-all duration-200 text-xs font-bold"
                  aria-label="Telegram"
                >
                  TG
                </a>
              )}
              {SOCIAL_LINKS.facebook && (
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-brand-gray-700 flex items-center justify-center text-brand-gray-300 hover:border-brand-cyan hover:text-brand-cyan transition-all duration-200 text-xs font-bold"
                  aria-label="Facebook"
                >
                  FB
                </a>
              )}
              {SOCIAL_LINKS.instagram && (
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-brand-gray-700 flex items-center justify-center text-brand-gray-300 hover:border-brand-cyan hover:text-brand-cyan transition-all duration-200 text-xs font-bold"
                  aria-label="Instagram"
                >
                  IG
                </a>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
