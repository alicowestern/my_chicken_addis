'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  {
    name: 'Products',
    href: '#',
    children: [
      { name: '45-Day Birds', href: '/birds' },
      { name: 'Poultry Feed', href: '/feed' },
    ],
  },
  {
    name: 'Services',
    href: '/services',
    children: [
      { name: 'Farmer Training', href: '/training' },
      { name: 'Financing', href: '/financing' },
    ],
  },
  { name: 'News & Events', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '#') return false
    if (href === '/') return pathname === '/'
    if (href === '/blog') return pathname.startsWith('/blog') || pathname.startsWith('/events')
    return pathname.startsWith(href)
  }

  const isChildActive = (children?: { href: string }[]) => {
    if (!children) return false
    return children.some(child => isActive(child.href))
  }

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-brand-dark-deep border-b border-[rgba(255,255,255,0.05)] shadow-soft">
      <div className="container-main">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-50">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-brand rounded-md flex items-center justify-center shadow-glow">
              <span className="text-brand-dark-deep font-bold text-lg font-heading">MC</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-brand-white font-heading leading-none">
                my chicken
              </span>
              <span className="text-sm font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none">
                addis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {navigation.map((item) => {
              const active = isActive(item.href) || isChildActive(item.children)
              
              if (item.children) {
                return (
                  <div key={item.name} className="relative group">
                    <button
                      className={`
                        flex items-center gap-1 text-sm font-medium transition-colors duration-300 py-2
                        ${active ? 'text-brand-cyan' : 'text-brand-light-gray group-hover:text-brand-cyan'}
                      `}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
                      {active && (
                        <span className="absolute bottom-0 left-1/2 w-1 h-1 bg-brand-cyan rounded-full -translate-x-1/2" />
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 w-48">
                      <div className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.05)] rounded-xl shadow-lg p-2 flex flex-col gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`
                              px-4 py-2.5 text-sm rounded-lg transition-colors duration-200 block
                              ${isActive(child.href) ? 'bg-[rgba(79,195,247,0.1)] text-brand-cyan' : 'text-brand-light-gray hover:bg-[rgba(255,255,255,0.05)] hover:text-brand-white'}
                            `}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    text-sm font-medium transition-colors duration-300 relative py-2
                    ${active ? 'text-brand-cyan' : 'text-brand-light-gray hover:text-brand-cyan'}
                  `}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 w-1 h-1 bg-brand-cyan rounded-full -translate-x-1/2" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-gradient-brand text-brand-dark-deep text-sm font-bold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110"
            >
              Talk to Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-brand-light-gray hover:text-brand-cyan transition-colors relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-24 border-t border-[rgba(255,255,255,0.05)] animate-fade-in bg-brand-dark-deep/95 backdrop-blur-xl fixed inset-0 z-40 w-full px-6 shadow-soft h-screen overflow-y-auto">
            <div className="flex flex-col gap-6">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="flex flex-col gap-4">
                      <div className="text-brand-muted font-medium text-sm tracking-widest uppercase">{item.name}</div>
                      <div className="flex flex-col gap-4 pl-4 border-l border-[rgba(255,255,255,0.1)]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                              text-xl font-medium transition-colors duration-200
                              ${isActive(child.href) ? 'text-brand-cyan' : 'text-brand-white hover:text-brand-cyan'}
                            `}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        text-xl font-medium transition-colors duration-200 block
                        ${isActive(item.href) || isChildActive(item.children) ? 'text-brand-cyan' : 'text-brand-white hover:text-brand-cyan'}
                      `}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-6 border-t border-[rgba(255,255,255,0.05)] mt-4">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-4 bg-gradient-brand text-brand-dark-deep font-bold rounded-lg"
                >
                  Talk to Us
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
