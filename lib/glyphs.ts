// Conjunto de glifos único do site: o DecryptedText (revelar) e o ScrambleText
// (criptografar) usam os mesmos caracteres, então os dois sentidos parecem o mesmo processo.
// Só ASCII: todos existem no JetBrains Mono e têm a mesma largura.
export const GLYPHS = 'ABCDEF0123456789#$%&*+=<>/\\|[]{}?!_-'
export const HEX = '0123456789ABCDEF'

export function randomGlyph(set: string = GLYPHS) {
  return set[Math.floor(Math.random() * set.length)]
}

export function randomHex(length: number) {
  let out = ''
  for (let i = 0; i < length; i++) out += randomGlyph(HEX)
  return out
}

// Hash curto e estável (FNV-1a, 32 bits) para mostrar uma "assinatura" do nome.
export function shortHash(text: string) {
  let h = 0x811c9dc5
  for (const ch of text) {
    h ^= ch.codePointAt(0) ?? 0
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}
