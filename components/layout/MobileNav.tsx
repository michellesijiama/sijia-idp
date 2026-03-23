'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useIDPContext } from '@/app/providers'
import { Avatar } from '@/components/ui/Avatar'
import { LayoutDashboard, FolderOpen, Settings, X } from 'lucide-react'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  activeSection: string
  onNavigate: (section: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function MobileNav({ open, onClose, activeSection, onNavigate }: MobileNavProps) {
  const { state } = useIDPContext()
  const { settings } = state
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden animate-fade-in bg-black/25 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden flex flex-col transition-transform duration-200 ease-out',
          'bg-white/80 backdrop-blur-2xl border-r border-white/30 shadow-2xl',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 h-12 border-b border-black/5">
          <div className="flex items-center gap-2">
            <Avatar avatar={settings.avatar} name={settings.name} size="sm" />
            <span className="font-semibold text-sm text-black">My IDP</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-none text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-colors"
            aria-label="Close menu"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm relative rounded-none transition-all duration-150',
                  isActive
                    ? 'bg-black/[0.06] text-black font-semibold'
                    : 'text-neutral-500 hover:bg-black/[0.03]'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gradient-to-b from-black to-neutral-600 rounded-none" />
                )}
                <Icon
                  size={16}
                  className={cn(isActive ? 'text-black' : 'text-neutral-400')}
                />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex print-hide bg-white/70 backdrop-blur-xl border-t border-white/30 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-colors duration-100',
                isActive ? 'text-black' : 'text-neutral-400'
              )}
            >
              <Icon size={19} />
              {item.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
