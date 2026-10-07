'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GLYPHS, randomGlyph } from '@/lib/glyphs'

// Campo de caracteres ao fundo, com a mesma linguagem da intro.
// - Três camadas de grade esparsa em profundidades diferentes (parallax no scroll).
// - Rolar faz uma faixa de "varredura" atravessar a tela: os caracteres que ela pega
//   embaralham, acendem e resolvem num glifo novo. Quanto mais rápido o scroll, mais intenso.
// - Perto do cursor, os caracteres também embaralham.
// - Parado, só um ou outro caractere troca de vez em quando.
// Movimento reduzido: o campo é desenhado uma vez e fica estático.

type Layer = {
  cell: number // espaçamento da grade (px)
  size: number // tamanho da fonte (px)
  speed: number // fração do scroll aplicada (parallax)
  alpha: number // opacidade de repouso
  density: number // fração das células com caractere
}

const LAYERS: Layer[] = [
  { cell: 18, size: 9, speed: 0.04, alpha: 0.05, density: 0.1 },
  { cell: 24, size: 11, speed: 0.1, alpha: 0.08, density: 0.12 },
  { cell: 32, size: 13, speed: 0.18, alpha: 0.11, density: 0.14 },
]

type Cell = {
  layer: number
  col: number
  row: number
  ch: string
  heat: number // 0..1: brilho extra, decai com o tempo
  scramble: number // trocas de glifo restantes antes de assentar
}

const SCRAMBLE_STEP = 55 // ms entre trocas de glifo enquanto embaralha
const HEAT_DECAY = 1 / 700 // perde todo o brilho em ~700ms
const BAND = 90 // altura da faixa de varredura (px)
const BAND_SPEED = 0.9 // a faixa anda 0,9px por px rolado
const POINTER_RADIUS = 70
const AMBIENT_EVERY = 260 // ms entre trocas espontâneas
const IDLE_FRAME = 1000 / 30 // sem scroll nem cursor, desenha a 30fps

const WHITE = '255, 255, 255'
const ACCENT = '127, 179, 163' // --accent-2

export default function CharField({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!visible) return
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const font = getComputedStyle(document.body).getPropertyValue('--font-mono').trim() || 'monospace'

    let width = 0
    let height = 0
    let cells: Cell[] = []
    let frame = 0
    let last = performance.now()
    let lastDraw = 0
    let lastScroll = window.scrollY
    let velocity = 0
    let budget = 0
    let ambientAt = 0
    let scrambleClock = 0
    const pointer = { x: -9999, y: -9999, moved: false }

    // Altura de uma volta da camada: múltiplo da célula, cobre a tela inteira.
    const wrapOf = (layer: Layer) => Math.ceil(height / layer.cell + 1) * layer.cell

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cells = []
      LAYERS.forEach((layer, li) => {
        const cols = Math.ceil(width / layer.cell)
        const rows = wrapOf(layer) / layer.cell
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if (Math.random() > layer.density) continue
            cells.push({ layer: li, col, row, ch: randomGlyph(GLYPHS), heat: 0, scramble: 0 })
          }
        }
      })
    }

    const positionOf = (cell: Cell, scroll: number) => {
      const layer = LAYERS[cell.layer]
      const wrap = wrapOf(layer)
      const x = cell.col * layer.cell + layer.cell / 2
      const y = ((((cell.row * layer.cell - scroll * layer.speed) % wrap) + wrap) % wrap) - layer.cell / 2
      return { x, y }
    }

    const ignite = (cell: Cell, heat = 1) => {
      cell.heat = Math.max(cell.heat, heat)
      cell.scramble = Math.max(cell.scramble, 3 + Math.floor(Math.random() * 5))
    }

    const draw = (scroll: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      let currentLayer = -1

      for (const cell of cells) {
        const { x, y } = positionOf(cell, scroll)
        if (y < -20 || y > height + 20) continue
        const layer = LAYERS[cell.layer]
        if (cell.layer !== currentLayer) {
          currentLayer = cell.layer
          ctx.font = `${layer.size}px ${font}`
        }
        if (cell.heat > 0.02) {
          ctx.fillStyle = `rgba(${ACCENT}, ${(layer.alpha + cell.heat * 0.6).toFixed(3)})`
        } else {
          ctx.fillStyle = `rgba(${WHITE}, ${layer.alpha})`
        }
        ctx.fillText(cell.ch, x, y)
      }
    }

    const step = (now: number) => {
      frame = requestAnimationFrame(step)
      const dt = Math.min(now - last, 64)
      last = now

      const scroll = window.scrollY
      const delta = scroll - lastScroll
      lastScroll = scroll
      velocity += (Math.abs(delta) - velocity) * 0.2
      const scrolling = velocity > 0.3

      // Faixa de varredura: acompanha o scroll e dá a volta na tela.
      if (scrolling) {
        const bandY = (((scroll * BAND_SPEED) % height) + height) % height
        budget += velocity * 0.35
        let tries = 0
        while (budget >= 1 && tries < 200) {
          tries++
          const cell = cells[Math.floor(Math.random() * cells.length)]
          const { y } = positionOf(cell, scroll)
          // 75% dentro da faixa, o resto espalhado.
          if (Math.abs(y - bandY) < BAND / 2 || Math.random() < 0.25) {
            ignite(cell)
            budget -= 1
          }
        }
        budget = Math.min(budget, 4)
      }

      if (pointer.moved) {
        pointer.moved = false
        for (const cell of cells) {
          const { x, y } = positionOf(cell, scroll)
          const dist = Math.hypot(x - pointer.x, y - pointer.y)
          if (dist < POINTER_RADIUS && Math.random() < 0.18) ignite(cell, 1 - dist / POINTER_RADIUS)
        }
      }

      if (now - ambientAt > AMBIENT_EVERY && cells.length) {
        ambientAt = now
        ignite(cells[Math.floor(Math.random() * cells.length)], 0.5)
      }

      scrambleClock += dt
      const swap = scrambleClock >= SCRAMBLE_STEP
      if (swap) scrambleClock = 0
      for (const cell of cells) {
        if (swap && cell.scramble > 0) {
          cell.scramble -= 1
          cell.ch = randomGlyph(GLYPHS)
        }
        if (cell.heat > 0 && cell.scramble === 0) cell.heat = Math.max(0, cell.heat - dt * HEAT_DECAY)
      }

      const busy = scrolling || now - lastDraw >= IDLE_FRAME
      if (!busy) return
      lastDraw = now
      draw(scroll)
    }

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.moved = true
    }

    const onResize = () => {
      build()
      if (reduce) draw(0)
    }

    build()
    window.addEventListener('resize', onResize)

    if (reduce) {
      draw(0)
    } else {
      frame = requestAnimationFrame(step)
      if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [visible])

  return (
    <div className={cn('charfield', visible && 'is-in')} aria-hidden="true">
      <canvas ref={ref} />
      <div className="charfield__vignette" />
    </div>
  )
}
