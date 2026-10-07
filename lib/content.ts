import type { Lang } from './i18n'

// Conteúdo placeholder (lorem ipsum). Troque aqui pelas informações reais,
// separando por idioma quando os textos forem traduzidos.

export type Segment = string | { text: string; href: string }

export type Artifact = {
  year: string
  title: string
  // Proporção do bloco (largura / altura) — quadrados e retângulos simulando projetos.
  ratio: [number, number]
}

export type RoleStatus = 'active' | 'beta' | 'archive'

export type Role = {
  company: string
  role: string
  start: string
  end?: string
  status: RoleStatus
  description: string
  ref: string
  months: number
}

export type ContactKind = 'email' | 'github' | 'linkedin'

export type Contact = { kind: ContactKind; label: string; href: string }

export type Content = {
  name: string
  wordmark: string
  statement: Segment[][]
  contacts: Contact[]
  artifacts: Artifact[]
  roles: Role[]
}

const lorem: Content = {
  name: 'Lorem Ipsum',
  wordmark: 'LOREM',
  statement: [
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ],
    [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco ',
      { text: 'laboris nisi', href: '#' },
      ' ut aliquip ex ea commodo consequat. Duis aute irure dolor in ',
      { text: 'reprehenderit', href: '#' },
      ' in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in ',
      { text: 'culpa qui officia', href: '#' },
      ' deserunt mollit anim id est laborum.',
    ],
    [
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis. Lorem ipsum at ',
      { text: 'lorem@ipsum.dev', href: '#' },
      ' or ',
      { text: '@loremipsum', href: '#' },
      '.',
    ],
  ],
  contacts: [
    // O email não abre link: o botão copia o endereço (href sem o "mailto:").
    { kind: 'email', label: 'Email', href: 'joaocarloslobo10@gmail.com' },
    { kind: 'github', label: 'GitHub', href: 'https://github.com/joaolobo10' },
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/jo%C3%A3o-lobo-17bb922b1/' },
  ],
  artifacts: [
    { year: '2026', title: 'Lorem ipsum', ratio: [1, 1] },
    { year: '2026', title: 'Dolor sit amet consectetur', ratio: [16, 10] },
    { year: '2025', title: 'Adipiscing elit sed do', ratio: [4, 5] },
    { year: '2025', title: 'Eiusmod tempor incididunt', ratio: [16, 9] },
    { year: '2024', title: 'Ut labore et dolore', ratio: [1, 1] },
    { year: '2024', title: 'Magna aliqua ut enim', ratio: [3, 2] },
    { year: '2023', title: 'Minim veniam quis', ratio: [3, 4] },
    { year: '2021-2023', title: 'Nostrud exercitation ullamco', ratio: [21, 9] },
  ],
  roles: [
    {
      company: 'Lorem Ipsum',
      role: 'Dolor sit amet · Consectetur',
      start: '2025',
      status: 'active',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      ref: 'a1b2c3d',
      months: 10,
    },
    {
      company: 'Adipiscing Elit',
      role: 'Sed do eiusmod · Tempor',
      start: '2023',
      end: '2025',
      status: 'archive',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
      ref: '4e5f6a7',
      months: 24,
    },
    {
      company: 'Incididunt Labore',
      role: 'Magna aliqua',
      start: '2024',
      status: 'beta',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.',
      ref: 'b8c9d0e',
      months: 18,
    },
    {
      company: 'Veniam Quis',
      role: 'Nostrud exercitation · Ullamco',
      start: '2021',
      end: '2023',
      status: 'archive',
      description:
        'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      ref: 'f1a2b3c',
      months: 26,
    },
  ],
}

export const content: Record<Lang, Content> = {
  pt: lorem,
  en: lorem,
}
