'use client'

import { useLang } from '@/lib/i18n'
import { content } from '@/lib/content'
import { cn } from '@/lib/utils'
import Reveal from './Reveal'
import { CornerMarks, SectionLabel } from './Marks'

// Mesmo cartão dos cargos, só com o cabeçalho: instituição, curso, período e status.
export default function Education() {
  const { lang, t } = useLang()
  const education = content[lang].education

  return (
    <section className="section">
      <Reveal>
        <SectionLabel {...t.sections.education} />
      </Reveal>
      <ul className="roles roles--compact">
        {education.map((item) => {
          const done = item.end !== undefined
          return (
            <li key={item.school}>
              <Reveal>
                <article className="role">
                  <header className="role__header">
                    <CornerMarks />
                    <div className="role__row">
                      <h3 className="role__title">{item.school}</h3>
                      <p className={cn('role__date', !done && 'is-open')}>
                        {item.start}–{item.end ?? <span className="role__date-open">····</span>}
                      </p>
                    </div>
                    <div className="role__row">
                      <p className="role__role">{item.degree}</p>
                      <span className={cn('status', done ? 'status--archive' : 'status--active')}>
                        <i className="status__dot" aria-hidden="true" />
                        {done ? t.education.done : t.education.progress}
                      </span>
                    </div>
                  </header>
                </article>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
