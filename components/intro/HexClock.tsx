'use client'

import { useEffect, useState } from 'react'
import { HEX, randomGlyph } from '@/lib/glyphs'

// Decorativo (aria-hidden): a hora ao vivo não é anunciada.
// Relógio que começa em hexadecimal (cada par HH, MM, SS em base 16: 15:08:33 -> 0F:08:21),
// embaralha e resolve para HH:MM:SS da esquerda para a direita, e depois segue ao vivo.
// Os dois formatos têm 8 caracteres, então a largura não muda (tabular-nums no CSS).

const HEX_HOLD = 650 // ms mostrando a hora em hex antes de resolver
const PER_CHAR = 55 // atraso entre uma posição e a próxima
const FLICKER = 110 // tempo que cada posição embaralha antes de assentar
const RESOLVED_AT = HEX_HOLD + 7 * PER_CHAR + FLICKER

function format(date: Date, base: number) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((n) => n.toString(base).toUpperCase().padStart(2, '0'))
    .join(':')
}

function utcOffset(date: Date) {
  const minutes = -date.getTimezoneOffset()
  const sign = minutes < 0 ? '−' : '+'
  const abs = Math.abs(minutes)
  const h = String(Math.floor(abs / 60)).padStart(2, '0')
  const m = abs % 60
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`
}

function frame(elapsed: number) {
  const now = new Date()
  const dec = format(now, 10)
  if (elapsed >= RESOLVED_AT) return { text: dec, resolved: true, now }
  const hex = format(now, 16)
  const text = Array.from(dec, (ch, i) => {
    if (ch === ':') return ch
    const start = HEX_HOLD + i * PER_CHAR
    if (elapsed < start) return hex[i]
    if (elapsed < start + FLICKER) return randomGlyph(HEX)
    return ch
  }).join('')
  return { text, resolved: false, now }
}

type Clock = { text: string; label: string }

type HexClockProps = {
  reduce: boolean
  className?: string
}

export default function HexClock({ reduce, className }: HexClockProps) {
  const [clock, setClock] = useState<Clock | null>(null)

  useEffect(() => {
    const start = performance.now()
    let fast: ReturnType<typeof setInterval> | undefined
    let slow: ReturnType<typeof setInterval> | undefined

    const tick = () => {
      const f = frame(reduce ? Infinity : performance.now() - start)
      setClock({ text: f.text, label: f.resolved ? utcOffset(f.now) : 'HEX' })
      // Depois de resolver, basta conferir a hora 4x por segundo.
      if (f.resolved && fast) {
        clearInterval(fast)
        fast = undefined
        slow = setInterval(tick, 250)
      }
    }

    const first = setTimeout(tick, 0)
    if (reduce) slow = setInterval(tick, 250)
    else fast = setInterval(tick, 45)

    return () => {
      clearTimeout(first)
      clearInterval(fast)
      clearInterval(slow)
    }
  }, [reduce])

  return (
    <span className={className}>
      <time className="intro__clock" aria-hidden="true">
        {clock?.text ?? '00:00:00'}
      </time>
      <span className="intro__clock-tag" aria-hidden="true">
        [{clock?.label ?? 'HEX'}]
      </span>
    </span>
  )
}
