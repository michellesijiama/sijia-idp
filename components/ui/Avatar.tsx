'use client'

import React from 'react'
import { getInitials } from '@/lib/utils'

interface AvatarProps {
  avatar?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'w-7 h-7 text-base',
  md: 'w-9 h-9 text-base',
  lg: 'w-14 h-14 text-xl',
}

export function Avatar({ avatar, name, size = 'sm' }: AvatarProps) {
  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt={name}
        className={`${sizes[size]} object-cover flex-shrink-0 border border-black/[0.06]`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-neutral-100 to-neutral-200 border border-black/[0.06]`}
    >
      <span className="font-semibold text-black">
        {getInitials(name || 'U')}
      </span>
    </div>
  )
}
