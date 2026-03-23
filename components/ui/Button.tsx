'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none select-none rounded-full'

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-b from-neutral-800 to-black text-white hover:from-neutral-700 hover:to-neutral-900 active:from-neutral-900 active:to-black shadow-md hover:shadow-lg',
    secondary: 'bg-white/60 backdrop-blur-sm text-black border border-black/[0.06] hover:bg-white/80 active:bg-white/90 shadow-sm',
    ghost: 'text-neutral-500 hover:bg-black/[0.04] hover:text-black active:bg-black/[0.07]',
    danger: 'bg-gradient-to-b from-neutral-800 to-black text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 shadow-md',
    outline: 'bg-white/40 backdrop-blur-sm text-black border border-black/10 hover:bg-white/70 active:bg-white/80 shadow-sm',
  }

  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-base gap-1.5',
    md: 'h-9 px-4 text-base gap-2',
    lg: 'h-10 px-5 text-base gap-2',
    icon: 'h-8 w-8 !rounded-full',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-3.5 w-3.5 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
}
