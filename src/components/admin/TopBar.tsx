'use client'

import { Bell, Search, User } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-neutral-200 h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search farmers, orders, leads..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-neutral-800">Admin</p>
              <p className="text-xs text-neutral-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
