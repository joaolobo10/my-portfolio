'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { LangProvider } from '@/lib/i18n'
import { readVisitor } from '@/lib/visitor'
import { SiteContext } from '@/components/site/context'
import Chrome from '@/components/site/Chrome'
import CharField from '@/components/site/CharField'
import Backdrop from '@/components/site/Backdrop'
import { Hero, Statement } from '@/components/site/Statement'
import Artifacts from '@/components/site/Artifacts'
import Roles from '@/components/site/Roles'
import Education from '@/components/site/Education'
import Languages from '@/components/site/Languages'
import Intro from '@/components/intro/Intro'
import Cursor from '@/components/site/Cursor'

// Fluxo: a intro (terminal) cobre a tela. Quando ela começa a abrir, o site fica
// "ready" e o conteúdo sobe por trás; quando termina, a intro desmonta.
function SiteInner() {
  const [ready, setReady] = useState(false)
  const [intro, setIntro] = useState(true)
  const [visitor, setVisitor] = useState<string | null>(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('is-locked')
    return () => root.classList.remove('is-locked')
  }, [])

  const onIntroReveal = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('skip-intro')
    }
    // A intro já salvou o nome antes de abrir.
    setVisitor(readVisitor())
    setReady(true)
  }, [])

  const onIntroDone = useCallback(() => {
    document.documentElement.classList.remove('is-locked')
    setIntro(false)
  }, [])

  const site = useMemo(() => ({ ready, visitor }), [ready, visitor])

  return (
    <SiteContext.Provider value={site}>
      <Cursor />
      {intro && <Intro onReveal={onIntroReveal} onDone={onIntroDone} />}

      <div inert={intro}>
        <Backdrop />
        <CharField visible={ready} />
        <div className="fade fade--top" aria-hidden="true" />
        <div className="fade fade--bottom" aria-hidden="true" />
        <Chrome visible={ready} />

        <div className="page">
          <main className="bio">
            <Hero />
            <Statement />
            <Artifacts />
            <Roles />
            <Education />
            <Languages />
          </main>
        </div>

        <svg className="grain" aria-hidden="true">
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>
      </div>
    </SiteContext.Provider>
  )
}

export default function Site() {
  return (
    <LangProvider>
      <SiteInner />
    </LangProvider>
  )
}
