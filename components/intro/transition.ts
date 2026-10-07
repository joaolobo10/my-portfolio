// Transição A · Colapso.
// 1. O terminal colapsa verticalmente numa linha verde (CRT desligando).
// 2. A linha se abre na vertical: o fundo preto é feito de duas metades que se afastam
//    a partir dela, e o site aparece pelo vão, como um olho abrindo.
// Só transform e opacity, via WAAPI (roda fora da thread principal).

export type ExitRefs = {
  root: HTMLElement
  screen: HTMLElement
  beam: HTMLElement
  top: HTMLElement
  bottom: HTMLElement
  edges: HTMLElement[]
  vignette: HTMLElement
}

type ExitCallbacks = {
  reduce: boolean
  // O site começa a aparecer por trás.
  onReveal: () => void
  // A intro pode desmontar.
  onDone: () => void
}

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)'

const COLLAPSE = 360
const OPEN = 720

export function runExit(refs: ExitRefs, { reduce, onReveal, onDone }: ExitCallbacks) {
  const animations: Animation[] = []
  const timers: ReturnType<typeof setTimeout>[] = []
  const play = (el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    animations.push(el.animate(keyframes, { fill: 'forwards', ...options }))
  }
  const cancel = () => {
    timers.forEach(clearTimeout)
    animations.forEach((a) => a.cancel())
  }

  // Movimento reduzido: um fade simples por cima do site já pronto.
  if (reduce) {
    onReveal()
    play(refs.root, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease' })
    timers.push(setTimeout(onDone, 240))
    return cancel
  }

  // 1. Colapso: o conteúdo achata no centro e apaga no fim.
  play(
    refs.screen,
    [
      { transform: 'scaleY(1)', opacity: 1 },
      { transform: 'scaleY(0.02)', opacity: 1, offset: 0.75 },
      { transform: 'scaleY(0.004)', opacity: 0 },
    ],
    { duration: COLLAPSE, easing: EASE_IN_OUT },
  )
  // A linha acende enquanto o terminal termina de achatar.
  play(
    refs.beam,
    [
      { transform: 'scaleX(0.35)', opacity: 0 },
      { transform: 'scaleX(1)', opacity: 1 },
    ],
    { duration: 220, delay: COLLAPSE - 200, easing: EASE_OUT },
  )

  // 2. A linha vira as bordas das duas metades, que se afastam e revelam o site.
  timers.push(
    setTimeout(() => {
      onReveal()
      play(refs.beam, [{ opacity: 0 }, { opacity: 0 }], { duration: 1 })
      refs.edges.forEach((edge) =>
        play(edge, [{ opacity: 1 }, { opacity: 0 }], { duration: OPEN, easing: EASE_OUT, delay: 120 }),
      )
      play(refs.top, [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], {
        duration: OPEN,
        easing: EASE_IN_OUT,
      })
      play(refs.bottom, [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], {
        duration: OPEN,
        easing: EASE_IN_OUT,
      })
      play(refs.vignette, [{ opacity: 1 }, { opacity: 0 }], { duration: OPEN / 2, easing: EASE_OUT })
    }, COLLAPSE),
  )

  timers.push(setTimeout(onDone, COLLAPSE + OPEN))
  return cancel
}
