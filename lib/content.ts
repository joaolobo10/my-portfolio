import type { Lang } from './i18n'

// Conteúdo do portfólio por idioma. Os projetos (artifacts) ainda são placeholder.

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

// Sem "end" = em andamento.
export type Education = {
  school: string
  degree: string
  start: string
  end?: string
}

export type Language = { name: string; level: string; code: string }

export type ContactKind = 'email' | 'github' | 'linkedin'

export type Contact = { kind: ContactKind; label: string; href: string }

export type Content = {
  name: string
  statement: Segment[][]
  contacts: Contact[]
  artifacts: Artifact[]
  roles: Role[]
  education: Education[]
  languages: Language[]
}

const OAS_URL = 'https://oas.unb.br/'

const contacts: Contact[] = [
  // O email não abre link: o botão copia o endereço (href sem o "mailto:").
  { kind: 'email', label: 'Email', href: 'joaocarloslobo10@gmail.com' },
  { kind: 'github', label: 'GitHub', href: 'https://github.com/joaolobo10' },
  { kind: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/jo%C3%A3o-lobo-17bb922b1/' },
]

const artifacts: Artifact[] = [
  { year: '2026', title: 'Lorem ipsum', ratio: [1, 1] },
  { year: '2026', title: 'Dolor sit amet consectetur', ratio: [16, 10] },
  { year: '2025', title: 'Adipiscing elit sed do', ratio: [4, 5] },
  { year: '2025', title: 'Eiusmod tempor incididunt', ratio: [16, 9] },
  { year: '2024', title: 'Ut labore et dolore', ratio: [1, 1] },
  { year: '2024', title: 'Magna aliqua ut enim', ratio: [3, 2] },
  { year: '2023', title: 'Minim veniam quis', ratio: [3, 4] },
  { year: '2021-2023', title: 'Nostrud exercitation ullamco', ratio: [21, 9] },
]

const pt: Content = {
  name: 'João Lobo',
  statement: [
    [
      'Sou estudante de Engenharia de Software na Universidade de Brasília, no 7º semestre, e hoje meu foco é deep learning e visão computacional. Venho me aprofundando em machine learning com Python, PyTorch e OpenCV, e é nessa direção que vão os próximos projetos desta página.',
    ],
    [
      'Pesquisa é o que mais me move. Desde outubro de 2024 sou pesquisador no ',
      { text: 'Open Automotive Simulator', href: OAS_URL },
      ', o simulador veicular da UnB voltado a ensino, pesquisa e desenvolvimento em engenharia automotiva. Construí boa parte do mundo da primeira versão na Unreal Engine 5, de mapas e terreno a trânsito, pedestres, MetaHumans e integração com o MATLAB, e hoje desenvolvo o OAS2 em Godot. O próximo passo é levar visão computacional para dentro do simulador.',
    ],
    [
      'Também gosto do lado criativo de fazer software: pensar como um produto vai funcionar, validar requisitos, desenhar funcionalidades e interfaces que facilitem a vida de quem usa e de quem mantém, sem abrir mão de desempenho. Em paralelo à pesquisa, passei pouco mais de um ano na Trix Tecnologia Inteligente, entre QA e desenvolvimento full stack em Java.',
    ],
  ],
  contacts,
  artifacts,
  roles: [
    {
      company: 'Universidade de Brasília',
      role: 'Pesquisador · Simulação veicular',
      start: '10.2024',
      status: 'active',
      description:
        'Pesquisa e desenvolvimento do Open Automotive Simulator. Na Unreal Engine 5, criei mapas, pistas, terreno e landscape com mistura de texturas, World Partition, HLOD e otimização gráfica; montei os sistemas de trânsito e pedestres com NPCs, MetaHumans animados, mapa infinito, a integração com o MATLAB e a UI dos menus. No OAS2, em Godot com GDScript, fiz as câmeras em 1ª e 3ª pessoa, os menus de carro e de parâmetros, a animação do volante e melhorias no modelo de frenagem, e desenvolvo um algoritmo que ajusta sozinho a posição do volante a cada carro.',
      ref: 'oas-sim',
      months: 24,
    },
    {
      company: 'Trix Tecnologia Inteligente',
      role: 'Estagiário · Desenvolvimento de Software',
      start: '09.2025',
      end: '08.2026',
      status: 'archive',
      description:
        'Desenvolvimento full stack em um sistema Java com arquitetura MVC, entre regras de negócio, interface e integração entre camadas. Corrigi bugs críticos, otimizei queries e a performance de páginas, e entreguei threads de exclusão automatizada, um sistema financeiro de automação de contas, rotinas de e-mail e a integração Java com N8n para uso de IA. Virei referência técnica em uma camada de regras de negócio.',
      ref: 'trx-dev',
      months: 12,
    },
    {
      company: 'Trix Tecnologia Inteligente',
      role: 'Estagiário · QA e Homologação',
      start: '07.2025',
      end: '09.2025',
      status: 'archive',
      description:
        'Validação e homologação de funcionalidades com o cliente final, com foco em fluxos de negócio e no processo de aceite. Nas reuniões com clientes, esclarecia dúvidas, levantava problemas e alinhava o comportamento esperado do sistema, fazendo a ponte entre usuários e time técnico.',
      ref: 'trx-qa',
      months: 2,
    },
  ],
  education: [
    { school: 'Universidade de Brasília (UnB)', degree: 'Bacharelado · Engenharia de Software', start: '2023' },
    {
      school: 'Instituto de Educação Superior de Brasília (IESB)',
      degree: 'Tecnólogo · Análise e Desenvolvimento de Sistemas',
      start: '2022',
      end: '2026',
    },
  ],
  languages: [
    { name: 'Português', level: 'Fluente', code: 'PT' },
    { name: 'Inglês', level: 'Avançado · C1', code: 'EN' },
  ],
}

const en: Content = {
  name: 'João Lobo',
  statement: [
    [
      "I'm a Software Engineering student at the University of Brasília, in my 7th semester, and my focus today is deep learning and computer vision. I've been going deeper into machine learning with Python, PyTorch and OpenCV, and that's where the next projects on this page are headed.",
    ],
    [
      'Research is what drives me most. Since October 2024 I have been a researcher on the ',
      { text: 'Open Automotive Simulator', href: OAS_URL },
      ", UnB's vehicle simulator for teaching, research and development in automotive engineering. I built much of the first version's world in Unreal Engine 5, from maps and terrain to traffic, pedestrians, MetaHumans and the MATLAB integration, and I now develop OAS2 in Godot. The next step is bringing computer vision into the simulator.",
    ],
    [
      'I also love the creative side of building software: thinking through how a product should work, validating requirements, and designing features and interfaces that make life easier for both the people who use it and the people who maintain it, without giving up performance. Alongside research, I spent just over a year at Trix Tecnologia Inteligente, moving from QA to full stack Java development.',
    ],
  ],
  contacts,
  artifacts,
  roles: [
    {
      company: 'University of Brasília',
      role: 'Researcher · Vehicle simulation',
      start: '10.2024',
      status: 'active',
      description:
        'Research and development of the Open Automotive Simulator. In Unreal Engine 5, I built maps, tracks, terrain and landscapes with texture blending, World Partition, HLOD and graphics optimization; I set up the traffic and pedestrian systems with NPCs, animated MetaHumans, an infinite map, the MATLAB integration and the menu UI. On OAS2, in Godot with GDScript, I built the first and third person cameras, the car and parameter menus, the steering wheel animation and braking model improvements, and I am developing an algorithm that automatically fits the steering wheel position to each car.',
      ref: 'oas-sim',
      months: 24,
    },
    {
      company: 'Trix Tecnologia Inteligente',
      role: 'Intern · Software Development',
      start: '09.2025',
      end: '08.2026',
      status: 'archive',
      description:
        'Full stack development on a Java MVC system, across business rules, interface and integration between layers. I fixed critical bugs, optimized queries and page performance, and shipped automated deletion threads, a financial system for account automation, email routines and a Java to N8n integration for AI features. I became the technical reference for one business rules layer.',
      ref: 'trx-dev',
      months: 12,
    },
    {
      company: 'Trix Tecnologia Inteligente',
      role: 'Intern · QA and Acceptance Testing',
      start: '07.2025',
      end: '09.2025',
      status: 'archive',
      description:
        'Validated and signed off features with the end client, focusing on business flows and the acceptance process. In client meetings I cleared up questions, raised issues and aligned expected system behavior, acting as the bridge between users and the technical team.',
      ref: 'trx-qa',
      months: 2,
    },
  ],
  education: [
    { school: 'University of Brasília (UnB)', degree: "Bachelor's · Software Engineering", start: '2023' },
    {
      school: 'Instituto de Educação Superior de Brasília (IESB)',
      degree: 'Associate degree · Systems Analysis and Development',
      start: '2022',
      end: '2026',
    },
  ],
  languages: [
    { name: 'Portuguese', level: 'Fluent', code: 'PT' },
    { name: 'English', level: 'Advanced · C1', code: 'EN' },
  ],
}

export const content: Record<Lang, Content> = { pt, en }
