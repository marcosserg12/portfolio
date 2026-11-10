# Portfólio — Marcos Sergio

Site pessoal em [marcossergio.com.br](https://marcossergio.com.br): um "sistema operacional" no navegador (MarcOS) com janelas arrastáveis, Dock, terminal que aceita comandos e os projetos apresentados como um explorador de arquivos, com prints reais dos sistemas.

## Stack

- Next.js 16 (export estático) + React 19 + TypeScript
- Tailwind CSS 4
- GSAP e Lenis para as animações e a rolagem
- Vitest (testes de conteúdo) e Playwright (testes ponta a ponta)

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

## Testes e build

```bash
npx vitest run           # dicionários PT/EN e links de contato
npx playwright test      # navegação, janelas, terminal, projetos, layout mobile
npm run build            # gera o site estático em out/
```

Os testes end-to-end usam o padrão Page Object:

```
e2e/
├── fixtures.ts          # test com a fixture `home` (o Page Object já criado)
├── pages/
│   ├── HomePage.ts      # a página única, que junta componentes e seções
│   ├── components/      # DesktopWindow, Dock, Terminal, MobileMenu
│   └── sections/        # HeroDesktop, About, Stack, Experience, Projects, Contact
├── support/viewports.ts # tamanhos de tela (celular, desktop, tela larga)
└── tests/               # desktop, seções, navegação e layout
```

Os Page Objects guardam os seletores e as ações; as asserções ficam nos testes.

O GitHub Actions (`.github/workflows/testes.yml`) roda a cada push: checagem de tipos e testes unitários num job, e no outro o build estático e a suíte do Playwright no Chromium, com nova tentativa para teste instável, trace na falha e o relatório HTML guardado como artefato.

## Conteúdo

Todos os textos ficam em `src/content/pt.ts` e `src/content/en.ts` (os dois idiomas precisam ter o mesmo formato; o teste confere). Os prints dos projetos ficam em `public/img/projetos/`, com nomes, telefones e outros dados pessoais trocados por dados fictícios antes da captura.

## Deploy

O build estático (`out/`) é servido pelo Nginx numa VPS Ubuntu, com HTTPS do Let's Encrypt.
