'use client'

import { useEffect, useState } from 'react'
import GlowCursor from '@/components/ui/GlowCursor/GlowCursor'

// Rastro de luz (React Bits) seguindo o cursor na página inteira, inclusive na intro.
// Só com mouse/trackpad e WebGL, e nunca com "reduzir movimento": nesses casos não aparece.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let webgl = false
    try {
      webgl = !!document.createElement('canvas').getContext('webgl')
    } catch {}
    if (!fine || calm || !webgl) return
    const raf = requestAnimationFrame(() => setEnabled(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!enabled) return null

  return (
    <GlowCursor
      className="glow-layer"
      color="#ffffff"
      secondaryColor="#7c3aed"
      listenOnWindow
      aria-hidden="true"
    />
  )
}
