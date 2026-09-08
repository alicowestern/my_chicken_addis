'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  Bird,
  Wheat,
  GraduationCap,
  Settings,
  LogOut,
  ShoppingCart,
  MessageSquare,
  Landmark,
  FileText,
  Calendar,
  Image,
  HelpCircle,
  Quote,
  Shield,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'

// ---- Navigation Config ----
const navSections = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Farmers', href: '/admin/farmers', icon: Users },
      { name: 'Birds', href: '/admin/birds', icon: Bird },
      { name: 'Feed', href: '/admin/feed', icon: Wheat },
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    ],
  },
  {
    label: 'Services',
    items: [
      { name: 'Training', href: '/admin/training', icon: GraduationCap },
      { name: 'Financing', href: '/admin/financing', icon: Landmark },
      { name: 'Leads', href: '/admin/leads', icon: MessageSquare },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Blog', href: '/admin/blog', icon: FileText },
      { name: 'Events', href: '/admin/events', icon: Calendar },
      { name: 'Gallery', href: '/admin/gallery', icon: Image },
      { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
      { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Audit Log', href: '/admin/audit', icon: Shield },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export default function Sidebar({ userName = 'Admin', userRole = 'ADMIN' }: { userName?: string; userRole?: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const [desktopCollapsed, setDesktopCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  // User initials for avatar
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const displayRole = userRole.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

  const sidebarContent = (isCollapsed: boolean) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center flex-shrink-0 px-6 pt-6 pb-5 ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
        <Link href="/" className={`flex flex-col group ${isCollapsed ? 'items-center' : ''}`}>
          <span className={`font-bold text-brand-white font-heading leading-none transition-colors group-hover:text-brand-cyan ${isCollapsed ? 'text-sm' : 'text-xl'}`}>
            {isCollapsed ? 'MCA' : 'my chicken'}
          </span>
          {!isCollapsed && (
            <>
              <span className="text-xs font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none">
                addis
              </span>
              <span className="text-[10px] text-brand-muted mt-2 tracking-widest uppercase">Admin Panel</span>
            </>
          )}
        </Link>
        {/* Mobile close button */}
        {!isCollapsed && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-brand-muted hover:text-brand-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Gradient separator */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-4 scrollbar-thin ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {navSections.map((section) => {
          const sectionCollapsed = collapsedSections[section.label]
          return (
            <div key={section.label} className="mb-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-brand-muted/60 tracking-[0.15em] uppercase hover:text-brand-muted transition-colors"
                >
                  {section.label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${sectionCollapsed ? '-rotate-90' : ''}`}
                  />
                </button>
              )}
              {isCollapsed && (
                <div className="px-3 py-2 text-[10px] font-bold text-brand-muted/40 tracking-[0.15em] uppercase text-center">
                  ---
                </div>
              )}
              {(!sectionCollapsed || isCollapsed) && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        title={isCollapsed ? item.name : undefined}
                        className={`
                          group flex items-center py-2 text-sm font-medium rounded-lg transition-all duration-200 relative
                          ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                          ${active
                            ? 'bg-brand-cyan/10 text-brand-cyan'
                            : 'text-brand-light-gray hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.04)]'
                          }
                        `}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-cyan rounded-r-full" />
                        )}
                        <Icon
                          className={`flex-shrink-0 h-[18px] w-[18px] transition-colors ${!isCollapsed ? 'mr-3' : ''} ${active ? 'text-brand-cyan' : 'text-brand-muted group-hover:text-brand-cyan'}`}
                          aria-hidden="true"
                        />
                        {!isCollapsed && item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User & Sign Out */}
      <div className="flex-shrink-0 border-t border-[rgba(255,255,255,0.05)] p-4 flex flex-col gap-2">
        {/* Collapse Toggle for Desktop */}
        <button
          onClick={() => setDesktopCollapsed(!desktopCollapsed)}
          className={`hidden lg:flex items-center justify-center w-full py-2 mb-2 rounded-lg text-brand-muted hover:text-brand-cyan hover:bg-[rgba(255,255,255,0.05)] transition-colors`}
          title={desktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className={`flex-shrink-0 w-full group block ${isCollapsed ? 'flex justify-center' : ''}`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <div className="flex items-center">
            <div className={`inline-flex rounded-full bg-gradient-to-br from-brand-cyan/30 to-brand-blue/20 items-center justify-center text-brand-cyan font-bold text-sm border border-brand-cyan/20 ${isCollapsed ? 'h-10 w-10' : 'h-9 w-9'}`}>
              {initials}
            </div>
            {!isCollapsed && (
              <div className="ml-3 text-left min-w-0">
                <p className="text-sm font-medium text-brand-white truncate">{userName}</p>
                <div className="flex items-center text-xs font-medium text-brand-muted group-hover:text-error transition-colors mt-0.5">
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign out
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger button — rendered in the admin layout via this component */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-brand-dark-deep/90 backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-brand-light-gray hover:text-brand-cyan shadow-card transition-all"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark-deep border-r border-[rgba(255,255,255,0.05)]
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent(false)}
      </div>

      {/* Desktop sidebar — always visible */}
      <div className={`hidden lg:flex lg:flex-col ${desktopCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out bg-brand-dark-deep border-r border-[rgba(255,255,255,0.05)] h-screen sticky top-0`}>
        {sidebarContent(desktopCollapsed)}
      </div>
    </>
  )
}
