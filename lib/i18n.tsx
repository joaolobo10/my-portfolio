'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'pt' | 'en'

const STORAGE_KEY = 'portfolio-lang'

// Textos de interface (rótulos, status, acessibilidade).
// O conteúdo em si (bio, projetos, cargos) fica em lib/content.ts.
export const ui = {
  pt: {
    hero: { hello: 'Olá', welcome: 'boas-vindas à minha página, eu sou' },
    sections: {
      statement: { path: '~ / sobre / declaracao.md', id: '§ 00.a' },
      artifacts: { path: '~ / trabalho / artefatos.[*]', id: '§ 01.a' },
      roles: { path: '~ / trabalho / cargos.md', id: '§ 01.b' },
      education: { path: '~ / formacao / academica.md', id: '§ 02.a' },
      languages: { path: '~ / formacao / idiomas.md', id: '§ 02.b' },
    },
    status: { active: '[ATIVO]', beta: '[BETA]', archive: '[ARQUIVO]' },
    education: { progress: '[EM ANDAMENTO]', done: '[CONCLUÍDO]' },
    duration: 'DURAÇÃO',
    months: 'MESES',
    langSwitch: 'Mudar idioma',
    like: 'Curtir',
    projects: 'Projetos',
    lightbox: {
      dialog: 'Visualização do projeto',
      close: 'FECHAR',
      prev: 'ANT',
      next: 'PRÓX',
    },
    intro: {
      dialog: 'Entrada do portfólio',
      skip: 'Pular intro',
      prompt: 'quem está acessando?',
      inputLabel: 'Seu nome',
      hint: 'Até 24 caracteres. Enter para confirmar.',
      errEmpty: 'ERR: input vazio',
      errLimit: 'ERR: limite de 24 caracteres',
      granted: 'Acesso liberado. Abrindo o portfólio.',
      welcomeBack: 'Bem-vindo de volta',
    },
  },
  en: {
    hero: { hello: 'Hello', welcome: "welcome to my page, I'm" },
    sections: {
      statement: { path: '~ / about / statement.md', id: '§ 00.a' },
      artifacts: { path: '~ / work / artifacts.[*]', id: '§ 01.a' },
      roles: { path: '~ / work / roles.md', id: '§ 01.b' },
      education: { path: '~ / education / academic.md', id: '§ 02.a' },
      languages: { path: '~ / education / languages.md', id: '§ 02.b' },
    },
    status: { active: '[ACTIVE]', beta: '[BETA]', archive: '[ARCHIVE]' },
    education: { progress: '[IN PROGRESS]', done: '[COMPLETED]' },
    duration: 'DURATION',
    months: 'MO',
    langSwitch: 'Switch language',
    like: 'Like',
    projects: 'Projects',
    lightbox: {
      dialog: 'Project preview',
      close: 'CLOSE',
      prev: 'PREV',
      next: 'NEXT',
    },
    intro: {
      dialog: 'Portfolio entrance',
      skip: 'Skip intro',
      prompt: 'who is accessing?',
      inputLabel: 'Your name',
      hint: 'Up to 24 characters. Press Enter to confirm.',
      errEmpty: 'ERR: empty input',
      errLimit: 'ERR: 24 character limit',
      granted: 'Access granted. Opening the portfolio.',
      welcomeBack: 'Welcome back',
    },
  },
} as const

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt')

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {}
    if (stored === 'pt' || stored === 'en') {
      const restored = stored
      requestAnimationFrame(() => setLangState(restored))
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return { ...ctx, t: ui[ctx.lang] }
}
