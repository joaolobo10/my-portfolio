'use client'

import { useLang } from '@/lib/i18n'
import { content } from '@/lib/content'
import { cn } from '@/lib/utils'
import Reveal from './Reveal'
import { CornerMarks, Divider, SectionLabel } from './Marks'

export default function Roles() {
  const { lang, t } = useLang()
  const roles = content[lang].roles

  return (
    <section className="section">
      <Reveal>
        <SectionLabel {...t.sections.roles} />
      </Reveal>
      <ul className="roles">
        {roles.map((role) => (
          <li key={role.ref}>
            <Reveal>
              <article className="role">
                <header className="role__header">
                  <CornerMarks />
                  <div className="role__row">
                    <h3 className="role__title">{role.company}</h3>
                    <p className={cn('role__date', !role.end && 'is-open')}>
                      {role.start}–{role.end ?? <span className="role__date-open">····</span>}
                    </p>
                  </div>
                  <div className="role__row">
                    <p className="role__role">{role.role}</p>
                    <span className={cn('status', `status--${role.status}`)}>
                      <i className="status__dot" aria-hidden="true" />
                      {t.status[role.status]}
                    </span>
                  </div>
                </header>
                <Divider />
                <p className="role__desc">{role.description}</p>
                <footer className="role__footer">
                  <p>REF: {role.ref}</p>
                  <p>
                    {t.duration}: ±{role.months} {t.months}
                  </p>
                </footer>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
