'use client'

import React from 'react'
import { useIDPContext } from '@/app/providers'
import { Avatar } from '@/components/ui/Avatar'
import { Cloud, Eye, Pencil } from 'lucide-react'

interface TopNavProps {
  onMenuOpen: () => void
  mode: 'edit' | 'review'
  onModeChange: (mode: 'edit' | 'review') => void
}

export function TopNav({ onMenuOpen, mode, onModeChange }: TopNavProps) {
  const { state, isSaving } = useIDPContext()
  const { settings } = state

  return (
    <header className="sticky top-0 z-30 h-12 flex items-center px-4 gap-3 bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* Mobile hamburger */}
      {mode === 'edit' && (
        <button className="lg:hidden flex items-center gap-2 mr-1" onClick={onMenuOpen} aria-label="Open menu">
          <Avatar avatar={settings.avatar} name={settings.name} size="sm" />
          <span className="font-semibold text-base text-black">My IDP</span>
        </button>
      )}

      {mode === 'review' && (
        <div className="flex items-center gap-2">
          <Avatar avatar={settings.avatar} name={settings.name} size="sm" />
          <span className="font-semibold text-base text-black">My IDP</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Auto-save indicator */}
      {isSaving && (
        <div className="hidden sm:flex items-center gap-1.5">
          <Cloud size={13} className="animate-pulse text-neutral-400" />
          <span className="text-base text-neutral-400">Saving...</span>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex items-center bg-black/[0.03] backdrop-blur-sm border border-black/[0.06] rounded-full p-0.5">
        <button
          onClick={() => onModeChange('review')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 text-base font-medium rounded-full transition-all duration-150',
            mode === 'review'
              ? 'bg-gradient-to-b from-neutral-800 to-black text-white shadow-sm'
              : 'text-neutral-500 hover:bg-white/60'
          )}
        >
          <Eye size={12} />
          Review
        </button>
        <button
          onClick={() => onModeChange('edit')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 text-base font-medium rounded-full transition-all duration-150',
            mode === 'edit'
              ? 'bg-gradient-to-b from-neutral-800 to-black text-white shadow-sm'
              : 'text-neutral-500 hover:bg-white/60'
          )}
        >
          <Pencil size={12} />
          Edit
        </button>
      </div>

      {/* User avatar */}
      {mode === 'edit' && (
        <div className="hidden md:flex items-center gap-2">
          <Avatar avatar={settings.avatar} name={settings.name} size="sm" />
          <div>
            <p className="text-base font-semibold leading-tight text-black">{settings.name}</p>
            <p className="text-base leading-tight text-neutral-400">{settings.title}</p>
          </div>
        </div>
      )}
    </header>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
