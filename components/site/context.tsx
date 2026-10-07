'use client'

import { createContext, useContext } from 'react'

// ready -> a intro terminou de abrir; o conteúdo pode aparecer.
type SiteContextValue = {
  ready: boolean
}

export const SiteContext = createContext<SiteContextValue>({ ready: false })

export const useSite = () => useContext(SiteContext)
