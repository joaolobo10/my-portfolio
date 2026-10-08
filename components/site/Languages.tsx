'use client'

import { useLang } from '@/lib/i18n'
import { content } from '@/lib/content'
import Reveal from './Reveal'
import { CornerMarks, SectionLabel } from './Marks'

// Mesmo cartão da formação: idioma, nível e código ao lado.
export default function Languages() {
  const { lang, t } = useLang()
  const languages = content[lang].languages

  return (
    <section className="section">
      <Reveal>
        <SectionLabel {...t.sections.languages} />
      </Reveal>
      <ul className="roles roles--compact">
        {languages.map((item) => (
          <li key={item.code}>
            <Reveal>
              <article className="role">
                <header className="role__header">
                  <CornerMarks />
                  <div className="role__row">
                    <h3 className="role__title">{item.name}</h3>
                    <p className="role__date">{item.code}</p>
                  </div>
                  <div className="role__row">
                    <p className="role__role">{item.level}</p>
                  </div>
                </header>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
