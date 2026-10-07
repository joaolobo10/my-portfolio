'use client'

// Pequenos elementos gráficos reaproveitados entre as seções.

import { useEffect, useRef, useState } from 'react'
import ScrambleText from '@/components/ScrambleText'
import { useSite } from './context'

// Rótulo da seção: se descriptografa quando entra na tela (mesmo gatilho do Reveal).
// O texto real fica para leitores de tela; os glifos são só visuais.
export function SectionLabel({ path, id }: { path: string; id: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const { ready } = useSite()
  const [seen, setSeen] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        setSeen(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  const play = ready && seen

  return (
    <h2 ref={ref} className="section-label">
      <span className="sr-only">
        {path} {id}
      </span>
      <ScrambleText text={path} mode="decrypt" play={play} reduce={reduce} speed={40} cipherClassName="is-cipher" />
      <ScrambleText text={id} mode="decrypt" play={play} reduce={reduce} speed={40} cipherClassName="is-cipher" />
    </h2>
  )
}

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider__lead">» » »</span>
      <span className="dots" />
      <span className="divider__cap">∆</span>
    </div>
  )
}

export function CornerMarks() {
  return (
    <>
      <span className="corner corner--tl" aria-hidden="true" />
      <span className="corner corner--tr" aria-hidden="true" />
      <span className="corner corner--bl" aria-hidden="true" />
      <span className="corner corner--br" aria-hidden="true" />
    </>
  )
}
