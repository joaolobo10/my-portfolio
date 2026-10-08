'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useLang, type Lang } from '@/lib/i18n'
import PulseHeart from '@/components/ui/PulseHeart/PulseHeart'

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [])
  return time
}

// Canto fixo no topo: curtida + troca de idioma + hora local.
// A curtida ainda não é salva: some ao recarregar a página.
export default function Chrome({ visible }: { visible: boolean }) {
  const { lang, setLang, t } = useLang()
  const time = useClock()
  const langs: Lang[] = ['pt', 'en']

  return (
    <aside className={cn('chrome', visible && 'is-in')}>
      <PulseHeart
        className="chrome__like"
        size={16}
        corner={999}
        pillColor="rgb(255 255 255 / 0.06)"
        idleColor="rgb(255 255 255 / 0.4)"
        likedColor="#ff4d6d"
        textColor="rgb(255 255 255 / 0.8)"
        label={t.like}
      />
      <div className="chrome__lang" role="group" aria-label={t.langSwitch}>
        {langs.map((code, i) => (
          <span key={code} className="chrome__lang-item">
            {i > 0 && (
              <span className="chrome__sep" aria-hidden="true">
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={cn('chrome__lang-btn', lang === code && 'is-active')}
            >
              {code}
            </button>
          </span>
        ))}
      </div>
      <span className="chrome__sep" aria-hidden="true">
        ·
      </span>
      <span className="chrome__time" aria-hidden="true">
        {time || '00:00:00'}
      </span>
    </aside>
  )
}
