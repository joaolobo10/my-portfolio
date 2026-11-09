'use client'

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import Image from 'next/image'
import { useLang } from '@/lib/i18n'
import { content, type Artifact } from '@/lib/content'
import { cn } from '@/lib/utils'
import { useSite } from './context'
import Reveal from './Reveal'
import { SectionLabel } from './Marks'

// Escala mínima dos cards que saem da coluna central em direção às bordas da tela.
const MIN_SCALE = 0.9
// Atraso entre a entrada de um card e o próximo (ms) e teto do atraso.
const STAGGER = 120
const MAX_DELAY = 720
// Distância (px) a partir da qual um clique com o mouse vira arrasto.
const DRAG_THRESHOLD = 4
// Velocidade máxima da inércia ao soltar (px/ms).
const MAX_GLIDE = 2.5

const aspect = (a: Artifact) => a.ratio[0] / a.ratio[1]

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

function Cover({ artifact, sizes }: { artifact: Artifact; sizes: string }) {
  if (!artifact.image) return <Placeholder artifact={artifact} />
  return <Image src={artifact.image} alt="" fill sizes={sizes} draggable={false} className="cover" />
}

export default function Artifacts() {
  const { lang, t } = useLang()
  const artifacts = content[lang].artifacts
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section">
      <Reveal>
        <SectionLabel {...t.sections.artifacts} />
      </Reveal>
      <Strip artifacts={artifacts} label={t.projects} onOpen={setOpen} />

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

type StripProps = {
  artifacts: Artifact[]
  label: string
  onOpen: (i: number) => void
}

// Faixa única de projetos: sangra até as bordas da tela, rola na horizontal
// (trackpad, shift + roda, toque ou arrastando com o mouse) e os cards que saem
// da coluna central encolhem um pouco em direção às bordas.
function Strip({ artifacts, label, onOpen }: StripProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const rollRef = useRef<HTMLUListElement>(null)
  const drag = useRef({ active: false, moved: false, x: 0, left: 0, lastX: 0, lastT: 0, v: 0 })
  const momentum = useRef(0)
  const { ready } = useSite()
  const [seen, setSeen] = useState(false)
  const maxAspect = Math.max(...artifacts.map(aspect))

  // Entrada em cascata quando a faixa aparece (mesmo gatilho do Reveal).
  useEffect(() => {
    const el = rollRef.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  // Escala de cada card pela distância até a coluna central.
  useEffect(() => {
    const roll = rollRef.current
    const shell = shellRef.current
    if (!roll || !shell) return
    let frame = 0

    const update = () => {
      frame = 0
      const col = shell.getBoundingClientRect()
      const center = col.left + col.width / 2
      const side = Math.max(1, (window.innerWidth - col.width) / 2)
      for (const item of Array.from(roll.querySelectorAll<HTMLElement>('.strip__item'))) {
        // A escala parte do centro-base, então o centro do retângulo não muda com ela.
        const box = item.getBoundingClientRect()
        const half = item.offsetWidth / 2
        const distance = Math.abs(box.left + box.width / 2 - center)
        const inside = Math.max(0, col.width / 2 - half)
        const over = Math.min(1, Math.max(0, distance - inside) / (side + half))
        item.style.setProperty('--edge-scale', String(1 - over * (1 - MIN_SCALE)))
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    roll.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(shell)
    return () => {
      cancelAnimationFrame(frame)
      roll.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
    }
  }, [artifacts])

  useEffect(() => () => cancelAnimationFrame(momentum.current), [])

  // Arrastar com o mouse (o toque já rola nativamente).
  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    cancelAnimationFrame(momentum.current)
    const roll = e.currentTarget
    drag.current = {
      active: true,
      moved: false,
      x: e.clientX,
      left: roll.scrollLeft,
      lastX: e.clientX,
      lastT: e.timeStamp,
      v: 0,
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.x
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      d.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.classList.add('is-dragging')
    }
    const dt = Math.max(1, e.timeStamp - d.lastT)
    d.v = Math.max(-MAX_GLIDE, Math.min(MAX_GLIDE, (e.clientX - d.lastX) / dt))
    d.lastX = e.clientX
    d.lastT = e.timeStamp
    e.currentTarget.scrollLeft = d.left - dx
  }

  const onPointerUp = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    if (!d.moved) return
    const roll = e.currentTarget
    roll.classList.remove('is-dragging')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Inércia: continua andando e desacelera depois de soltar.
    let v = d.v * 16
    const glide = () => {
      if (Math.abs(v) < 0.4) return
      roll.scrollLeft -= v
      v *= 0.94
      momentum.current = requestAnimationFrame(glide)
    }
    momentum.current = requestAnimationFrame(glide)
  }

  return (
    <div
      ref={shellRef}
      className={cn('strip', ready && seen && 'is-in')}
      style={{ '--strip-max-aspect': maxAspect } as CSSProperties}
    >
      <ul
        ref={rollRef}
        className="strip__roll"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          // Soltar depois de arrastar não abre o projeto.
          if (drag.current.moved) {
            e.preventDefault()
            e.stopPropagation()
            drag.current.moved = false
          }
        }}
      >
        {artifacts.map((artifact, i) => (
          <li
            key={`${artifact.year}-${artifact.title}`}
            className="strip__reveal"
            style={{ '--reveal-delay': `${Math.min(i * STAGGER, MAX_DELAY)}ms` } as CSSProperties}
          >
            <div className="strip__item" style={{ '--r': aspect(artifact) } as CSSProperties}>
              <button
                type="button"
                className="strip__frame"
                onClick={() => onOpen(i)}
                aria-label={`[${artifact.year}] ${artifact.title}`}
              >
                <Cover artifact={artifact} sizes="(max-width: 720px) 90vw, 640px" />
              </button>
              <span className="strip__caption" aria-hidden="true">
                <span className="strip__date">[{artifact.year}]</span>
                <span className="strip__title">{artifact.title}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
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
      style={{ '--r': aspect(artifact) } as CSSProperties}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div key={index} className="lightbox__stage">
        <Cover artifact={artifact} sizes="(max-width: 1280px) 86vw, 1100px" />
      </div>
      <div className="lightbox__meta">
        <span>
          [{artifact.year}] {artifact.title}
        </span>
        <span className="lightbox__controls">
          {artifact.href && (
            <a href={artifact.href} target="_blank" rel="noreferrer">
              [{t.lightbox.visit} ↗]
            </a>
          )}
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
