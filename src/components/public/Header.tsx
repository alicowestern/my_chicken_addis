'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  const [isScrolled, setIsScrolled] = useState(false)

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

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    closeMobileMenu()
  }, [pathname, closeMobileMenu])

  return (
    <header 
      className={`
        sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-gray-200 
        transition-all duration-300
        ${isScrolled ? 'shadow-sm py-2' : 'py-4'}
      `}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-50">
            <img src="/Images/logo.png" alt="My Chicken Addis Logo" className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-brand-gray-900 font-heading leading-none">
                My Chicken
              </span>
              <span className="text-[10px] sm:text-sm font-bold text-brand-cyan-dark tracking-[0.2em] uppercase mt-0.5 sm:mt-1 leading-none">
                Addis
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
                        ${active ? 'text-brand-cyan-dark' : 'text-brand-gray-600 group-hover:text-brand-cyan-dark'}
                      `}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 w-48">
                      <div className="bg-white border border-brand-gray-200 rounded-xl shadow-lg p-2 flex flex-col gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`
                              px-4 py-2.5 text-sm rounded-lg transition-colors duration-200 block
                              ${isActive(child.href) ? 'bg-brand-gray-50 text-brand-cyan-dark' : 'text-brand-gray-600 hover:bg-brand-gray-50 hover:text-brand-gray-900'}
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
                    ${active ? 'text-brand-cyan-dark' : 'text-brand-gray-600 hover:text-brand-cyan-dark'}
                  `}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-brand-gray-900 text-white text-sm font-bold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:brightness-110"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-brand-gray-600 hover:text-brand-cyan-dark transition-colors relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Dropdown) */}
      <div
        className={`
          lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-b border-brand-gray-200
          transition-all duration-300 ease-in-out origin-top z-40
          ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
        <nav className="px-6 py-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-brand-gray-500 font-bold text-xs tracking-widest uppercase">{item.name}</div>
                    <div className="flex flex-col gap-2 pl-3 border-l-2 border-brand-gray-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={closeMobileMenu}
                          className={`
                            text-base font-medium py-1 transition-colors duration-200
                            ${isActive(child.href) ? 'text-brand-cyan-dark' : 'text-brand-gray-700 hover:text-brand-cyan-dark'}
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
                    onClick={closeMobileMenu}
                    className={`
                      text-base font-medium transition-colors duration-200 block py-1
                      ${isActive(item.href) || isChildActive(item.children) ? 'text-brand-cyan-dark' : 'text-brand-gray-900 hover:text-brand-cyan-dark'}
                    `}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-brand-gray-100 mt-2">
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block w-full text-center py-3 bg-brand-gray-900 text-white font-bold rounded-xl text-sm shadow-sm hover:bg-brand-cyan-dark transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
