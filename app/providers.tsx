'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useIDP } from '@/hooks/useIDP'
import { IDPState } from '@/lib/types'
import { SAMPLE_STATE } from '@/lib/data'

const PAGE_ID = 'main'

const DEFAULT_STATE: IDPState = SAMPLE_STATE

type IDPContextType = ReturnType<typeof useIDP> & { isSaving: boolean }

const IDPContext = createContext<IDPContextType | null>(null)

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full animate-spin border-2 border-neutral-200 border-t-black" />
        <p className="text-base text-neutral-400">Loading IDP...</p>
      </div>
    </div>
  )
}

export function IDPProvider({ children }: { children: React.ReactNode }) {
  const [initialData, setInitialData] = useState<IDPState | null>(null)

  useEffect(() => {
    supabase
      .from('idp_data')
      .select('data')
      .eq('page_id', PAGE_ID)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') console.error('Load error:', error)
        const loaded = data?.data ?? DEFAULT_STATE
        // Handle migration: if old format with goals, use default
        if (loaded.goals && !loaded.categories) {
          setInitialData(DEFAULT_STATE)
        } else {
          // Ensure macroGoal exists for data saved before this field was added
          if (!loaded.macroGoal) {
            loaded.macroGoal = { title: '', description: '' }
          }
          setInitialData(loaded)
        }
      })
  }, [])

  if (!initialData) return <Spinner />

  return <IDPDataProvider initialData={initialData}>{children}</IDPDataProvider>
}

function IDPDataProvider({
  initialData,
  children,
}: {
  initialData: IDPState
  children: React.ReactNode
}) {
  const [isSaving, setIsSaving] = useState(false)

  const cloudSave = useCallback(async (state: IDPState) => {
    setIsSaving(true)
    const { error } = await supabase.from('idp_data').upsert({
      page_id: PAGE_ID,
      data: state,
      updated_at: new Date().toISOString(),
    })
    if (error) console.error('Save error:', error)
    setIsSaving(false)
  }, [])

  const idp = useIDP(initialData, cloudSave)

  return (
    <IDPContext.Provider value={{ ...idp, isSaving }}>
      {children}
    </IDPContext.Provider>
  )
}

export function useIDPContext() {
  const ctx = useContext(IDPContext)
  if (!ctx) throw new Error('useIDPContext must be used within IDPProvider')
  return ctx
}
