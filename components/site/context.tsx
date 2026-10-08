'use client'

import { createContext, useContext } from 'react'

// ready -> a intro terminou de abrir; o conteúdo pode aparecer.
// visitor -> nome digitado na intro (null se o visitante pulou sem se identificar).
type SiteContextValue = {
  ready: boolean
  visitor: string | null
}

export const SiteContext = createContext<SiteContextValue>({ ready: false, visitor: null })

export const useSite = () => useContext(SiteContext)
