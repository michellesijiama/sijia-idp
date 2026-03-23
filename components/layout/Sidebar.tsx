'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FolderOpen, Settings, TrendingUp } from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 fixed top-0 left-0 bottom-0 z-40 bg-white/70 backdrop-blur-xl border-r border-white/30 shadow-[1px_0_12px_rgba(0,0,0,0.03)]">
      {/* Logo area */}
      <div className="flex items-center gap-2.5 px-4 h-12 border-b border-black/5">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-black to-neutral-700 shadow-md">
          <TrendingUp size={13} className="text-white" />
        </div>
        <span className="font-semibold text-black text-sm tracking-tight">My IDP</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-sm relative rounded-lg transition-all duration-150',
                isActive
                  ? 'bg-black/[0.06] text-black font-semibold backdrop-blur-sm shadow-sm'
                  : 'text-neutral-500 hover:bg-black/[0.03] hover:text-black'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gradient-to-b from-black to-neutral-600 rounded-full" />
              )}
              <Icon
                size={16}
                className={cn('flex-shrink-0', isActive ? 'text-black' : 'text-neutral-400')}
              />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-black/5">
        <p className="text-sm text-neutral-400">Individual Development Plan</p>
      </div>
    </aside>
  )
}
