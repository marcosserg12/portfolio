# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two audiences, weighted equally (confirmed 2026-10-21):
- **Recruiters and tech leads** evaluating Marcos for a PHP / Full Stack position (CLT or PJ). They skim experience, stack and education, then download the CV or open LinkedIn.
- **Prospective freelance clients** (small and mid-size businesses) who need a custom web system. They look at what he has built and want a fast way to start a conversation (WhatsApp / e-mail).

## Product Purpose
A personal portfolio for Marcos Sergio Jordão de Sousa, PHP and Full Stack developer in Brasília, DF. Success: a visitor understands in seconds who he is and what he builds, sees credible proof (real employers, real systems), and contacts him or downloads the CV.

## Positioning
Six years building and maintaining web systems that run in production for healthcare (Ibranutro, Fiocruz), the public sector (Brazilian Navy civil department) and finance (Consórcio Banco do Brasil), plus six self-built products (e-commerce, SaaS, time clock, expense control, AI customer service with N8N, help desk). Builder of working internal software, not landing pages.

## Operating Context
Visitors arrive from LinkedIn, the CV, job platforms or a direct link, on desktop (recruiters) and phone (clients via WhatsApp). The site must be bilingual (PT-BR default, EN). Contact happens off-site: e-mail, WhatsApp, LinkedIn, CV PDF download.

## Capabilities and Constraints
- Existing stack: Next.js (static export) + TypeScript + Tailwind 4 + GSAP/ScrollTrigger + Lenis; content in `src/content/pt.ts` / `en.ts`; Vitest + Playwright tests.
- No backend, no contact form. Phone number must not be printed on the page (only inside the wa.me link).
- Must respect `prefers-reduced-motion` and work without JavaScript.

## Brand Commitments
- The user asked for the site to feel like a piece of software (the page behaves like an app: windows, terminal, editor) with his 3D avatar at the centre.
- Hero = his 3D avatar (`Gemini_Generated_Image_cfw0wpcfw0wpcfw0.jpg`: hoodie, laptop with PHP, Java and Claude stickers), animated waving at the visitor.
- Rejected directions (do not return to them): dark neon cyan/violet with glow and glass; "Brasília modernista" concrete/ipê editorial.

## Evidence on Hand
- CV: `MARCOS SERGIO JORDÃO DE SOUSA.pdf` (also served as `public/cv/marcos-sergio-cv.pdf`).
- Real photo (`017b13be-…jpg`), background-removed photo (`Gemini_Generated_Image_x1i4gkx1i4gkx1i4.jpg`), 3D avatar (`Gemini_Generated_Image_cfw0wpcfw0wpcfw0.jpg`).
- Employers, dates, stack and education exactly as in the CV.
- Projects exist only as names in the CV: descriptions, domains and stacks on the site are drafts awaiting the user's review. No screenshots, URLs, metrics, clients or testimonials exist — never fabricate them.

## Product Principles
1. Proof over claims: real employers, dates and working systems carry the page.
2. Two doors, both obvious: "hire me" (CV / LinkedIn) and "build for me" (WhatsApp / e-mail) are always one step away.
3. Personality through the avatar and the software metaphor, never through decoration.
4. Fast and calm on a phone over WhatsApp links; motion never hides content.
