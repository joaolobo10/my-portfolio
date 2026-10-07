'use client'

import { useEffect, useRef, useState } from 'react'
import { graphemes } from '@/lib/visitor'
import { GLYPHS, randomGlyph } from '@/lib/glyphs'

// Variante do DecryptedText (React Bits) que também anda no sentido inverso.
// - encrypt: o texto legível vira glifos, da esquerda para a direita.
// - decrypt: os glifos resolvem no texto, da esquerda para a direita.
// Trabalha por grafema (acentos e emojis não quebram) e usa o mesmo GLYPHS.

type Mode = 'encrypt' | 'decrypt'

type Cell = { ch: string; cipher: boolean }

type ScrambleTextProps = {
  text: string
  mode: Mode
  speed?: number
  // Ticks extras embaralhando tudo antes de assentar no texto cifrado final.
  settle?: number
  reduce?: boolean
  // Enquanto false, fica parado no estado inicial (útil para esperar o elemento aparecer).
  play?: boolean
  onDone?: () => void
  className?: string
  cipherClassName?: string
}

// Estado inicial determinístico (o servidor e o cliente renderizam igual).
function initialCells(parts: string[], mode: Mode): Cell[] {
  return parts.map((ch, i) =>
    mode === 'decrypt' && ch !== ' '
      ? { ch: GLYPHS[(i * 7) % GLYPHS.length], cipher: true }
      : { ch, cipher: false },
  )
}

export default function ScrambleText({
  text,
  mode,
  speed = 45,
  settle = 5,
  reduce = false,
  play = true,
  onDone,
  className,
  cipherClassName,
}: ScrambleTextProps) {
  const [cells, setCells] = useState<Cell[]>(() => initialCells(graphemes(text), mode))
  const done = useRef(onDone)

  useEffect(() => {
    done.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!play) return
    const parts = graphemes(text)
    const n = parts.length
    // Nomes longos avançam vários grafemas por tick: a duração fica perto de 12 ticks.
    const step = Math.max(1, Math.ceil(n / 12))
    const cipher = parts.map((ch) => (ch === ' ' ? ' ' : randomGlyph()))

    const finalCells: Cell[] =
      mode === 'encrypt'
        ? cipher.map((ch) => ({ ch, cipher: ch !== ' ' }))
        : parts.map((ch) => ({ ch, cipher: false }))

    if (reduce) {
      const id = setTimeout(() => {
        setCells(finalCells)
        done.current?.()
      }, 0)
      return () => clearTimeout(id)
    }

    let tick = 0
    const total = Math.ceil(n / step) + (mode === 'encrypt' ? settle : 0)

    const id = setInterval(() => {
      tick += 1
      const front = tick * step

      if (tick >= total) {
        clearInterval(id)
        setCells(finalCells)
        done.current?.()
        return
      }

      setCells(
        parts.map((ch, i) => {
          if (ch === ' ') return { ch, cipher: false }
          const passed = i < front
          // encrypt: o que a frente já passou vira glifo. decrypt: o que ela passou resolve.
          const scrambled = mode === 'encrypt' ? passed : !passed
          return scrambled ? { ch: randomGlyph(), cipher: true } : { ch, cipher: false }
        }),
      )
    }, speed)

    return () => clearInterval(id)
  }, [text, mode, speed, settle, reduce, play])

  return (
    <span className={className} aria-hidden="true">
      {cells.map((cell, i) => (
        <span key={i} className={cell.cipher ? cipherClassName : undefined}>
          {cell.ch}
        </span>
      ))}
    </span>
  )
}
