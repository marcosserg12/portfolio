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

## Conteúdo

Todos os textos ficam em `src/content/pt.ts` e `src/content/en.ts` (os dois idiomas precisam ter o mesmo formato; o teste confere). Os prints dos projetos ficam em `public/img/projetos/`, com nomes, telefones e outros dados pessoais trocados por dados fictícios antes da captura.

## Deploy

O build estático (`out/`) é servido pelo Nginx numa VPS Ubuntu, com HTTPS do Let's Encrypt.
