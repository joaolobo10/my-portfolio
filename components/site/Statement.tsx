'use client'

import { useLang } from '@/lib/i18n'
import { content } from '@/lib/content'
import Reveal from './Reveal'
import { SectionLabel } from './Marks'
import Contacts from './Contacts'

export function Hero() {
  const { lang } = useLang()
  return (
    <Reveal className="hero">
      <header className="logo" aria-label={content[lang].name}>
        <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M4 6h32l-8 28H14l3-10H8z" />
        </svg>
        <span className="logo__word">{content[lang].wordmark}</span>
      </header>
    </Reveal>
  )
}

export function Statement() {
  const { lang, t } = useLang()
  const { statement, contacts } = content[lang]

  return (
    <section className="section">
      <Reveal>
        <SectionLabel {...t.sections.statement} />
      </Reveal>
      <div className="statement">
        {statement.map((paragraph, i) => (
          <Reveal key={i} delay={200 + i * 200}>
            <p>
              {paragraph.map((segment, j) =>
                typeof segment === 'string' ? (
                  segment
                ) : (
                  <a key={j} href={segment.href} className="statement__link">
                    {segment.text}
                  </a>
                ),
              )}
            </p>
          </Reveal>
        ))}
        <Reveal delay={200 + statement.length * 200}>
          <Contacts contacts={contacts} />
        </Reveal>
      </div>
    </section>
  )
}
