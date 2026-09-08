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
    <div className="flex flex-col h-full overflow-hidden bg-brand-dark-deep/95 backdrop-blur-xl">
      {/* Top Header & Logo */}
      <div className={`flex items-center flex-shrink-0 px-4 pt-6 pb-5 ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          {/* Menu Toggle Top Left */}
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg text-brand-muted hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all hover:shadow-[0_0_15px_rgba(79,195,247,0.3)] group"
            title={desktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
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

          {/* Logo Text */}
          <Link href="/" className={`flex flex-col group ${isCollapsed ? 'items-center mt-2' : ''}`}>
            <span className={`font-bold text-brand-white font-heading leading-none transition-all group-hover:text-brand-cyan group-hover:drop-shadow-[0_0_8px_rgba(79,195,247,0.5)] ${isCollapsed ? 'text-sm' : 'text-xl'}`}>
              {isCollapsed ? 'MCA' : 'my chicken'}
            </span>
            {!isCollapsed && (
              <>
                <span className="text-xs font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none group-hover:text-brand-blue transition-colors">
                  addis
                </span>
                <span className="text-[10px] text-brand-muted mt-2 tracking-widest uppercase opacity-70">Admin Panel</span>
              </>
            )}
          </Link>
        </div>
      </div>

      {/* Glow separator */}
      <div className="mx-4 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent shadow-[0_0_10px_rgba(79,195,247,0.2)]" />

      {/* Navigation */}
      <nav className={`flex-1 min-h-0 overflow-y-auto py-4 scrollbar-thin ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navSections.map((section) => {
          const sectionCollapsed = collapsedSections[section.label]
          return (
            <div key={section.label} className="mb-2">
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-2 py-2 mb-1 text-[10px] font-bold text-brand-muted/70 tracking-[0.15em] uppercase hover:text-brand-cyan transition-colors"
                >
                  {section.label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${sectionCollapsed ? '-rotate-90' : ''}`}
                  />
                </button>
              )}
              {isCollapsed && (
                <div className="px-2 py-3 text-[9px] font-bold text-brand-muted/40 tracking-[0.2em] uppercase text-center border-b border-brand-cyan/10 mx-2 mb-2">
                  {section.label.slice(0, 3)}
                </div>
              )}
              {(!sectionCollapsed || isCollapsed) && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        title={isCollapsed ? item.name : undefined}
                        className={`
                          group flex items-center py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden
                          ${isCollapsed ? 'justify-center px-0 mx-1' : 'px-4'}
                          ${active
                            ? 'bg-gradient-to-r from-brand-cyan/20 to-brand-cyan/5 text-brand-cyan shadow-[inset_0_0_20px_rgba(79,195,247,0.15)]'
                            : 'text-brand-light-gray hover:text-brand-cyan hover:bg-brand-cyan/10'
                          }
                        `}
                      >
                        {/* Active Glowing Bar */}
                        {active && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-cyan rounded-r-full shadow-[0_0_10px_rgba(79,195,247,0.8)]" />
                        )}
                        {!isCollapsed ? (
                          <span className="truncate group-hover:translate-x-1 transition-transform duration-300">
                            {item.name}
                          </span>
                        ) : (
                          <span className={`flex items-center justify-center flex-shrink-0 w-9 h-9 rounded-xl font-bold text-sm transition-all duration-300
                            ${active 
                              ? 'bg-gradient-to-br from-brand-cyan/30 to-brand-cyan/10 text-brand-cyan shadow-[0_0_12px_rgba(79,195,247,0.4)] border border-brand-cyan/30' 
                              : 'bg-[rgba(255,255,255,0.03)] text-brand-muted group-hover:bg-[rgba(79,195,247,0.1)] group-hover:text-brand-cyan border border-[rgba(255,255,255,0.05)] group-hover:border-brand-cyan/20'}
                          `}>
                            {item.name.charAt(0)}
                          </span>
                        )}
                        
                        {/* Hover flare effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User & Sign Out (Static Bottom) */}
      <div className="flex-shrink-0 mt-auto border-t border-[rgba(255,255,255,0.05)] bg-black/20 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className={`flex-shrink-0 w-full group block rounded-xl p-2 transition-all duration-300 hover:bg-[rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] ${isCollapsed ? 'flex justify-center' : ''}`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <div className="flex items-center">
            <div className={`inline-flex rounded-full bg-gradient-to-br from-brand-cyan/30 to-brand-blue/20 items-center justify-center text-brand-cyan font-bold text-sm border border-brand-cyan/20 shadow-[0_0_10px_rgba(79,195,247,0.2)] group-hover:border-error/30 group-hover:text-error transition-all ${isCollapsed ? 'h-10 w-10' : 'h-10 w-10'}`}>
              {initials}
            </div>
            {!isCollapsed && (
              <div className="ml-3 text-left min-w-0">
                <p className="text-sm font-medium text-brand-white truncate group-hover:text-error transition-colors">{userName}</p>
                <div className="flex items-center text-xs font-medium text-brand-muted group-hover:text-error transition-colors mt-0.5">
                  <LogOut className="w-3.5 h-3.5 mr-1 group-hover:animate-pulse" />
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
