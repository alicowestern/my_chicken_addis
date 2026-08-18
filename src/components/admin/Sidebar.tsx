import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Bird,
  Wheat,
  GraduationCap,
  Settings,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Farmers', href: '/admin/farmers', icon: Users },
  { name: 'Birds', href: '/admin/birds', icon: Bird },
  { name: 'Feed', href: '/admin/feed', icon: Wheat },
  { name: 'Training', href: '/admin/training', icon: GraduationCap },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-brand-dark-deep border-r border-[rgba(255,255,255,0.05)] h-screen sticky top-0">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-bold text-brand-white font-heading leading-none">
              my chicken
            </span>
            <span className="text-xs font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none">
              addis
            </span>
            <span className="text-[10px] text-brand-muted mt-2 tracking-widest uppercase">Admin Panel</span>
          </Link>
        </div>
        <nav className="mt-8 flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-brand-light-gray hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.05)] transition-colors"
              >
                <Icon
                  className="mr-3 flex-shrink-0 h-5 w-5 text-brand-muted group-hover:text-brand-cyan"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-[rgba(255,255,255,0.05)] p-4">
        <button className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div className="inline-block h-9 w-9 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-bold border border-brand-cyan/30">
              A
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-brand-white">Admin User</p>
              <div className="flex items-center text-xs font-medium text-brand-muted group-hover:text-error transition-colors mt-0.5">
                <LogOut className="w-3 h-3 mr-1" />
                Sign out
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
