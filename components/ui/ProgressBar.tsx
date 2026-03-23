'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const [width, setWidth] = useState(animated ? 0 : value)
  const hasAnimated = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated) {
      setWidth(value)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const timer = setTimeout(() => setWidth(value), 50)
          return () => clearTimeout(timer)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, animated])

  useEffect(() => {
    if (hasAnimated.current) {
      setWidth(value)
    }
  }, [value])

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={cn('space-y-1', className)} ref={ref}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Progress</span>
          <span className="text-sm font-semibold text-black">{value}%</span>
        </div>
      )}
      <div
        className={cn('w-full overflow-hidden rounded-none bg-black/[0.06]', heights[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-none bg-gradient-to-r from-neutral-800 via-black to-neutral-700"
          style={{
            width: `${width}%`,
            transition: animated ? 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
