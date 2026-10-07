'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import DecryptedText from '@/components/DecryptedText'
import { useLang } from '@/lib/i18n'
import { NAME_MAX, graphemes, readVisitor, sanitizeName, saveVisitor } from '@/lib/visitor'
import HexClock from './HexClock'
import ScrambleText from '@/components/ScrambleText'
import { GLYPHS, randomHex, shortHash } from '@/lib/glyphs'
import { runExit } from './transition'
import './intro.css'

const OWNER = 'JOÃO LOBO'
const OWNER_SPOKEN = 'João Lobo'
const COORDS = '23.5505° S · 046.6333° W'

// boot     -> primeiro frame (igual no servidor e no cliente): só a tela preta
// hello    -> nome do dono e relógio se descriptografando
// identify -> terminal pedindo o nome do visitante
// encrypt  -> nome digitado vira cifra + logs
// back     -> visitante com nome salvo: "welcome back" e entra direto
// A transição de saída roda por cima do estágio atual (flag `exiting`).
type Stage = 'boot' | 'hello' | 'identify' | 'encrypt' | 'back'

const HELLO_HOLD = 1700 // nome + relógio antes do prompt
const BACK_HOLD = 1500 // "welcome back" antes de entrar
const LOG_STEP = 180 // intervalo entre as linhas de log
const GRANTED_HOLD = 480 // "access granted" na tela antes da transição

type IntroProps = {
  onReveal: () => void
  onDone: () => void
}

type Delay = CSSProperties & { '--d': string }
const delay = (ms: number): Delay => ({ '--d': `${ms}ms` })

// Texto fixo com o DecryptedText do React Bits. Com movimento reduzido, aparece pronto.
function Decrypt({ text, reduce, speed = 55 }: { text: string; reduce: boolean; speed?: number }) {
  if (reduce) return <span aria-hidden="true">{text}</span>
  return (
    <DecryptedText
      text={text}
      animateOn="view"
      sequential
      revealDirection="start"
      speed={speed}
      characters={GLYPHS}
      encryptedClassName="is-cipher"
      aria-hidden="true"
    />
  )
}

export default function Intro({ onReveal, onDone }: IntroProps) {
  const { t } = useLang()
  const s = t.intro

  const [stage, setStage] = useState<Stage>('boot')
  const [reduce, setReduce] = useState(false)
  const [meta, setMeta] = useState({ ref: '0000000', sid: '0000-0000' })
  const [visitor, setVisitor] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState<'empty' | 'limit' | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [logs, setLogs] = useState(0)
  const [caret, setCaret] = useState(false)
  const [exiting, setExiting] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const leaving = useRef(false)
  const callbacks = useRef({ onReveal, onDone })

  useEffect(() => {
    callbacks.current = { onReveal, onDone }
  }, [onReveal, onDone])

  // Decide o roteiro no cliente: visitante novo ou de volta.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const saved = readVisitor()
      setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      setMeta({ ref: randomHex(7).toLowerCase(), sid: `${randomHex(4)}-${randomHex(4)}` })
      if (saved) {
        setVisitor(saved)
        setStage('back')
      } else {
        setStage('hello')
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const leave = useCallback(() => {
    if (leaving.current) return
    leaving.current = true
    setExiting(true)
  }, [])

  // Transição de saída.
  useEffect(() => {
    if (!exiting) return
    const root = rootRef.current
    const screen = screenRef.current
    const beam = beamRef.current
    const top = topRef.current
    const bottom = bottomRef.current
    const vignette = vignetteRef.current
    if (!root || !screen || !beam || !top || !bottom || !vignette) return
    const edges = Array.from(root.querySelectorAll<HTMLElement>('.intro__edge'))
    return runExit(
      { root, screen, beam, top, bottom, edges, vignette },
      {
        reduce,
        onReveal: () => callbacks.current.onReveal(),
        onDone: () => callbacks.current.onDone(),
      },
    )
  }, [exiting, reduce])

  // Linha do tempo: hello -> identify, back -> saída.
  useEffect(() => {
    if (exiting) return
    if (stage === 'hello') {
      const id = setTimeout(() => setStage('identify'), reduce ? 400 : HELLO_HOLD)
      return () => clearTimeout(id)
    }
    if (stage === 'back') {
      const id = setTimeout(leave, reduce ? 900 : BACK_HOLD)
      return () => clearTimeout(id)
    }
  }, [stage, reduce, exiting, leave])

  // Foco no input só com mouse/trackpad: no celular o teclado abriria sozinho e cobriria a tela.
  useEffect(() => {
    if (stage !== 'identify') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const id = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)
    return () => clearTimeout(id)
  }, [stage])

  // Logs depois da cifra: encrypting -> sig -> access granted -> saída.
  useEffect(() => {
    if (stage !== 'encrypt' || logs === 0 || exiting) return
    if (logs < 3) {
      const id = setTimeout(() => setLogs((n) => n + 1), reduce ? 0 : LOG_STEP)
      return () => clearTimeout(id)
    }
    const id = setTimeout(leave, reduce ? 700 : GRANTED_HOLD)
    return () => clearTimeout(id)
  }, [stage, logs, reduce, exiting, leave])

  const onCipherDone = useCallback(() => setLogs(1), [])

  // Cursor em bloco só quando o caret está no fim do texto e o campo não rolou;
  // nos outros casos fica o caret nativo (seleção no meio, texto largo demais, nome RTL).
  const syncCaret = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    const end = el.value.length
    const atEnd = el.selectionStart === end && el.selectionEnd === end
    let rtl = false
    try {
      rtl = el.matches(':dir(rtl)')
    } catch {}
    setCaret(document.activeElement === el && atEnd && !rtl && el.scrollWidth <= el.clientWidth)
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = sanitizeName(e.target.value)
    setValue(next.value)
    if (next.clipped) {
      setError('limit')
      setAttempt((n) => n + 1)
    } else {
      setError(null)
    }
    requestAnimationFrame(syncCaret)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (stage !== 'identify' || exiting) return
    const name = value.trim()
    if (!name) {
      setError('empty')
      setAttempt((n) => n + 1)
      inputRef.current?.focus()
      return
    }
    saveVisitor(name)
    setVisitor(name)
    setCaret(false)
    setStage('encrypt')
  }

  const onKeyDown = (e: KeyboardEvent) => {
    // Esc durante uma composição (IME) só cancela a composição.
    if (e.key === 'Escape' && !e.nativeEvent.isComposing) leave()
  }

  const count = graphemes(value).length
  const errorText = error === 'empty' ? s.errEmpty : error === 'limit' ? s.errLimit : ''
  const announce =
    stage === 'encrypt' && logs >= 3
      ? s.granted
      : stage === 'back'
        ? `${s.welcomeBack}, ${visitor}.`
        : ''

  return (
    <div
      ref={rootRef}
      className="intro"
      data-stage={stage}
      data-exiting={exiting || undefined}
      role="dialog"
      aria-modal="true"
      aria-label={s.dialog}
      onKeyDown={onKeyDown}
    >
      {/* Fundo em duas metades: na saída, elas se afastam a partir da linha central. */}
      <div ref={topRef} className="intro__half intro__half--top" aria-hidden="true">
        <span className="intro__edge" />
      </div>
      <div ref={bottomRef} className="intro__half intro__half--bottom" aria-hidden="true">
        <span className="intro__edge" />
      </div>
      <div ref={vignetteRef} className="intro__vignette" aria-hidden="true" />

      <button type="button" className="intro__skip" onClick={leave} disabled={exiting}>
        <span className="sr-only">{s.skip}: </span>
        <span aria-hidden="true">[ </span>SKIP<span aria-hidden="true"> ]</span>
      </button>

      <div ref={screenRef} className="intro__screen">
        {stage !== 'boot' && (
          <div className="intro__term">
            <div className="intro__row intro__meta intro__in" aria-hidden="true">
              <span>§ 00.a</span>
              <span className="intro__rule" />
              <span>REF: {meta.ref}</span>
            </div>

            <div className="intro__row intro__bar intro__in" style={delay(60)}>
              <span className="intro__lead" aria-hidden="true">
                »
              </span>
              <p className="intro__owner">
                <span className="sr-only">{OWNER_SPOKEN}</span>
                <Decrypt text={OWNER} reduce={reduce} />
              </p>
              <span className="intro__rule" aria-hidden="true" />
              <HexClock reduce={reduce} className="intro__time" />
              <span className="intro__cap" aria-hidden="true">
                ∆
              </span>
            </div>

            <div className="intro__row intro__meta intro__in" style={delay(140)} aria-hidden="true">
              <span className="intro__sid">◊ SID {meta.sid}</span>
              <span className="intro__rule" />
              <span className="intro__coords">{COORDS}</span>
            </div>

            {stage === 'back' && (
              <div className="intro__block intro__in" style={delay(220)}>
                <p className="intro__line">
                  <span className="intro__sign" aria-hidden="true">
                    &gt;
                  </span>
                  <span className="intro__cmd">
                    <Decrypt text="welcome back," reduce={reduce} speed={35} />
                  </span>
                  <ScrambleText
                    className="intro__value"
                    cipherClassName="is-cipher"
                    mode="decrypt"
                    text={visitor}
                    reduce={reduce}
                  />
                </p>
              </div>
            )}

            {(stage === 'identify' || stage === 'encrypt') && (
              <form className="intro__block intro__in" onSubmit={onSubmit} noValidate>
                <p className="intro__ask">
                  <span className="intro__dim" aria-hidden="true">
                    § 01 —
                  </span>{' '}
                  <span className="sr-only">{s.prompt}</span>
                  <Decrypt text={s.prompt} reduce={reduce} speed={30} />
                </p>

                <div className="intro__line">
                  <span className="intro__sign" aria-hidden="true">
                    &gt;
                  </span>
                  <span className="intro__cmd" aria-hidden="true">
                    identify --user
                  </span>

                  {stage === 'identify' ? (
                    <span className="intro__field" data-caret={caret || undefined}>
                      <label htmlFor="intro-name" className="sr-only">
                        {s.inputLabel}
                      </label>
                      <input
                        ref={inputRef}
                        id="intro-name"
                        name="visitor"
                        type="text"
                        dir="auto"
                        className="intro__input"
                        value={value}
                        onChange={onChange}
                        onSelect={syncCaret}
                        onFocus={syncCaret}
                        onBlur={() => setCaret(false)}
                        autoComplete="given-name"
                        autoCapitalize="words"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="go"
                        aria-invalid={error === 'empty' || undefined}
                        aria-describedby="intro-hint intro-err"
                      />
                      <span className="intro__ghost" aria-hidden="true">
                        <span className="intro__ghost-text">{value}</span>
                        <span className="intro__caret" />
                      </span>
                    </span>
                  ) : (
                    <>
                      <span className="sr-only">{visitor}</span>
                      <ScrambleText
                        className="intro__value"
                        cipherClassName="is-cipher"
                        mode="encrypt"
                        text={visitor}
                        reduce={reduce}
                        onDone={onCipherDone}
                      />
                    </>
                  )}

                  {stage === 'identify' && (
                    <span className="intro__count" aria-hidden="true">
                      {String(count).padStart(2, '0')}/{NAME_MAX}
                    </span>
                  )}
                </div>

                {stage === 'identify' && (
                  <div className="intro__foot">
                    {/* Região estável; só o texto interno remonta (a cada tentativa) para tremer de novo. */}
                    <p id="intro-err" className="intro__err" role="alert">
                      {errorText && (
                        <span key={attempt} className="intro__err-text">
                          {errorText}
                        </span>
                      )}
                    </p>
                    <p id="intro-hint" className="sr-only">
                      {s.hint}
                    </p>
                    <button type="submit" className="intro__btn">
                      <span aria-hidden="true">[ </span>ENTER<span aria-hidden="true"> ]</span>
                    </button>
                  </div>
                )}

                {stage === 'encrypt' && (
                  <ol className="intro__logs" aria-hidden="true">
                    {logs >= 1 && (
                      <li className="intro__log">
                        <span>» encrypting</span>
                        <span className="intro__rule" />
                        <span className="intro__ok">ok</span>
                      </li>
                    )}
                    {logs >= 2 && (
                      <li className="intro__log">
                        <span>» sig {shortHash(visitor)}</span>
                        <span className="intro__rule" />
                        <span className="intro__ok">ok</span>
                      </li>
                    )}
                    {logs >= 3 && (
                      <li className="intro__log intro__log--granted">
                        <span>» access granted</span>
                      </li>
                    )}
                  </ol>
                )}
              </form>
            )}
          </div>
        )}
      </div>

      <div ref={beamRef} className="intro__beam" aria-hidden="true" />

      <p className="sr-only" role="status">
        {announce}
      </p>
    </div>
  )
}
