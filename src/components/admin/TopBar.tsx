'use client'

import { Bell, Search, User } from 'lucide-react'

export default function TopBar({ userName = 'Admin', userRole = 'ADMIN' }: { userName?: string; userRole?: string }) {
  const displayRole = userRole.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="hidden lg:flex sticky top-0 z-20 bg-brand-dark-deep/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.05)] h-14 items-center px-6">
      <div className="flex items-center justify-between w-full">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray group-focus-within:text-brand-cyan transition-colors" />
            <input
              type="text"
              placeholder="Search farmers, orders, leads..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-brand-dark/60 border border-[rgba(255,255,255,0.06)] rounded-lg text-brand-white placeholder:text-brand-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan/40 focus:bg-brand-dark transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 ml-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-brand-muted hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.05)] rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-brand-dark-deep" />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-[rgba(255,255,255,0.06)]" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan/30 to-brand-blue/20 rounded-full flex items-center justify-center border border-brand-cyan/20">
              <span className="text-xs font-bold text-brand-cyan">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-brand-white leading-tight">{userName}</p>
              <p className="text-[11px] text-brand-muted leading-tight">{displayRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
