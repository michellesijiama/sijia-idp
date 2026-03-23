'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressSliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function ProgressSlider({ value, onChange, disabled }: ProgressSliderProps) {
  const presets = [0, 25, 50, 75, 100]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">Progress</label>
        <span className="text-lg font-bold tabular-nums text-black">
          {value}%
        </span>
      </div>

      {/* Slider */}
      <div className="relative pt-1">
        <div className="relative h-2 bg-black/[0.06] rounded-full">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-neutral-800 via-black to-neutral-700 transition-all duration-150"
            style={{ width: `${value}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ margin: 0 }}
          aria-label={`Progress: ${value}%`}
        />
        {/* Thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md pointer-events-none transition-all duration-150"
          style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>

      {/* Quick preset buttons */}
      <div className="flex items-center gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => !disabled && onChange(preset)}
            disabled={disabled}
            className={cn(
              'text-sm font-medium px-2.5 py-1 rounded-full transition-all duration-150',
              value === preset
                ? 'bg-gradient-to-b from-neutral-800 to-black text-white shadow-sm'
                : 'text-neutral-500 bg-white/50 backdrop-blur-sm border border-black/[0.04] hover:bg-white/80',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  )
}
