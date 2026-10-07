'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Github, Linkedin, Mail } from 'lucide-react'
import type { Contact, ContactKind } from '@/lib/content'

const icons: Record<ContactKind, typeof Mail> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
}

const COPIED_LABEL = 'Copied'
const COPIED_TIME = 1600

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback para contextos sem a Clipboard API (ex.: http na rede local).
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    document.execCommand('copy')
    field.remove()
  }
}

// Ícone do email: o envelope dá lugar a um check depois de copiar.
function EmailGlyph() {
  return (
    <>
      <Mail className="contact__glyph contact__glyph--idle" />
      <Check className="contact__glyph contact__glyph--done" />
    </>
  )
}

// Duas camadas: a de baixo some para cima e a de cima entra junto com o preenchimento.
function Face({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="contact__fill" />
      <span className="contact__face contact__face--rest">{children}</span>
      <span className="contact__face contact__face--hover">{children}</span>
    </>
  )
}

function Tip({ label, copied }: { label: string; copied?: boolean }) {
  return (
    <span className="contact__tip" aria-hidden="true">
      <span className="contact__tip-label contact__tip-label--idle">{label}</span>
      {copied !== undefined && (
        <span className="contact__tip-label contact__tip-label--done">{COPIED_LABEL}</span>
      )}
    </span>
  )
}

function EmailButton({ contact }: { contact: Contact }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // O feedback aparece no clique, sem esperar a Clipboard API (que pode demorar a resolver).
  const onCopy = () => {
    void copyText(contact.href)
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), COPIED_TIME)
  }

  return (
    <div className="contact-wrap" data-copied={copied ? '' : undefined}>
      <button
        type="button"
        className="contact"
        onClick={onCopy}
        aria-label={`${contact.label}: ${contact.href}`}
      >
        <Face>
          <EmailGlyph />
        </Face>
      </button>
      <Tip label={contact.label} copied={copied} />
      <span className="sr-only" aria-live="polite">
        {copied ? COPIED_LABEL : ''}
      </span>
    </div>
  )
}

export default function Contacts({ contacts }: { contacts: Contact[] }) {
  return (
    <nav className="contacts">
      {contacts.map((c) => {
        if (c.kind === 'email') return <EmailButton key={c.kind} contact={c} />
        const Icon = icons[c.kind]
        return (
          <div key={c.kind} className="contact-wrap">
            <a
              href={c.href}
              className="contact"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={c.label}
            >
              <Face>
                <Icon className="contact__glyph" />
              </Face>
            </a>
            <Tip label={c.label} />
          </div>
        )
      })}
    </nav>
  )
}
