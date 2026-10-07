'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLang } from '@/lib/i18n'
import { content, type Artifact } from '@/lib/content'
import { HeroParallax, type ParallaxItem } from '@/components/ui/hero-parallax'
import Reveal from './Reveal'
import { CornerMarks, SectionLabel } from './Marks'

const ROWS = 3
// Largura mínima de cada fileira, medida em alturas de card: cobre a tela inteira
// (até monitores ultrawide) com sobra dos dois lados para andar sem mostrar o fim.
const ROW_UNITS = 18
const GAP_UNITS = 0.08

type Card = ParallaxItem & { index: number; artifact: Artifact }

// Divide os projetos em fileiras na ordem (a ordem do teclado segue a cronologia)
// e completa cada fileira com cópias decorativas dos dois lados, deixando os
// originais no meio da tela.
function buildRows(artifacts: Artifact[]): Card[][] {
  const size = Math.ceil(artifacts.length / ROWS)
  const rows: Card[][] = []

  for (let r = 0; r < ROWS; r++) {
    const own = artifacts
      .map((artifact, index) => ({ artifact, index }))
      .slice(r * size, r * size + size)
    if (!own.length) continue

    const card = (src: (typeof own)[number], key: string, clone: boolean): Card => ({
      key,
      clone,
      index: src.index,
      artifact: src.artifact,
      ratio: src.artifact.ratio[0] / src.artifact.ratio[1],
    })
    const units = (c: Card) => c.ratio + GAP_UNITS

    const row = own.map((src) => card(src, String(src.index), false))
    let width = row.reduce((sum, c) => sum + units(c), 0)
    let after = 0
    let before = 0
    while (width < ROW_UNITS) {
      if (after <= before) {
        const next = card(own[after % own.length], `${r}-a${after}`, true)
        row.push(next)
        width += units(next)
        after++
      } else {
        const prev = card(own[own.length - 1 - (before % own.length)], `${r}-b${before}`, true)
        row.unshift(prev)
        width += units(prev)
        before++
      }
    }
    rows.push(row)
  }
  return rows
}

function Placeholder({ artifact }: { artifact: Artifact }) {
  const [w, h] = artifact.ratio
  return (
    <span className="placeholder">
      <svg className="placeholder__x" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="placeholder__ratio">
        {w}:{h}
      </span>
    </span>
  )
}

function TileContent({ artifact }: { artifact: Artifact }) {
  return (
    <>
      <CornerMarks />
      <Placeholder artifact={artifact} />
      <span className="tile__caption" aria-hidden="true">
        <span className="tile__date">[{artifact.year}]</span>
        <span className="tile__title">{artifact.title}</span>
      </span>
    </>
  )
}

export default function Artifacts() {
  const { lang, t } = useLang()
  const artifacts = content[lang].artifacts
  const [open, setOpen] = useState<number | null>(null)
  const rows = buildRows(artifacts)

  return (
    <section className="section">
      <Reveal>
        <SectionLabel {...t.sections.artifacts} />
      </Reveal>
      <Reveal delay={150}>
        <HeroParallax
          rows={rows}
          label={t.projects}
          renderCard={(card) =>
            card.clone ? (
              // Cópia decorativa: o mouse também abre o projeto; teclado e leitor usam o original.
              <div className="tile" onClick={() => setOpen(card.index)}>
                <TileContent artifact={card.artifact} />
              </div>
            ) : (
              <button
                type="button"
                className="tile"
                onClick={() => setOpen(card.index)}
                aria-label={`[${card.artifact.year}] ${card.artifact.title}`}
              >
                <TileContent artifact={card.artifact} />
              </button>
            )
          }
        />
      </Reveal>

      {open !== null && (
        <Lightbox
          artifacts={artifacts}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  )
}

type LightboxProps = {
  artifacts: Artifact[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}

function Lightbox({ artifacts, index, onIndex, onClose }: LightboxProps) {
  const { t } = useLang()
  const closeRef = useRef<HTMLButtonElement>(null)
  const artifact = artifacts[index]
  const total = artifacts.length
  const go = (step: number) => onIndex((index + step + total) % total)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.documentElement.classList.add('is-locked')
    return () => {
      document.documentElement.classList.remove('is-locked')
      previous?.focus()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % total)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + total) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, total, onClose, onIndex])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t.lightbox.dialog}
      style={{ '--r': artifact.ratio[0] / artifact.ratio[1] } as CSSProperties}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div key={index} className="lightbox__stage">
        <Placeholder artifact={artifact} />
      </div>
      <div className="lightbox__meta">
        <span>
          [{artifact.year}] {artifact.title}
        </span>
        <span className="lightbox__controls">
          <button type="button" onClick={() => go(-1)}>
            [← {t.lightbox.prev}]
          </button>
          <span className="lightbox__count">
            {pad(index + 1)} / {pad(total)}
          </span>
          <button type="button" onClick={() => go(1)}>
            [{t.lightbox.next} →]
          </button>
          <button ref={closeRef} type="button" onClick={onClose}>
            [ESC {t.lightbox.close}]
          </button>
        </span>
      </div>
    </div>
  )
}
