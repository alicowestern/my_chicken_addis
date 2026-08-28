'use client'

import { Bell, Search, User } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-brand-dark-deep/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] h-16 flex items-center px-4 sm:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
            <input
              type="text"
              placeholder="Search farmers, orders, leads..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-brand-surface border border-[rgba(255,255,255,0.1)] rounded-lg text-brand-white placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 focus:border-brand-cyan transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4 ml-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-brand-muted hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.05)] rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* User */}
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-[rgba(255,255,255,0.08)]">
            <div className="w-8 h-8 bg-brand-cyan/20 rounded-full flex items-center justify-center border border-brand-cyan/30">
              <User className="w-4 h-4 text-brand-cyan" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-white">Admin</p>
              <p className="text-xs text-brand-muted">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
