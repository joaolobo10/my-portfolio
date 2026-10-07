// Nome do visitante: limpeza do texto digitado e persistência no navegador.

export const NAME_MAX = 24
const NAME_KEY = 'portfolio-visitor-name'

// Caracteres de controle e de direção de texto (evitam quebras de linha coladas
// e nomes que invertem o texto ao redor). ZWJ e seletores de variação ficam,
// porque fazem parte de emojis compostos.
const CONTROL = /[\p{Cc}​‌‎‏‪-‮⁠-⁤⁦-⁩﻿]/gu

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

// Divide por grafema: "ã", "👩‍💻" e "🇧🇷" contam como um caractere cada.
export function graphemes(text: string): string[] {
  if (segmenter) return Array.from(segmenter.segment(text), (s) => s.segment)
  return Array.from(text)
}

// Sem controles, sem espaço no começo, sem espaços repetidos e no máximo NAME_MAX grafemas.
export function sanitizeName(raw: string) {
  const cleaned = raw
    .normalize('NFC')
    .replace(CONTROL, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^ /, '')
  const parts = graphemes(cleaned)
  return {
    value: parts.slice(0, NAME_MAX).join(''),
    length: Math.min(parts.length, NAME_MAX),
    clipped: parts.length > NAME_MAX,
  }
}

export function readVisitor() {
  try {
    const stored = localStorage.getItem(NAME_KEY)
    if (!stored) return null
    return sanitizeName(stored).value.trim() || null
  } catch {
    return null
  }
}

export function saveVisitor(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name)
  } catch {}
}
