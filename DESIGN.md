# Design — MarcOS

The portfolio is a desktop operating system called MarcOS, drawn like macOS: a light wallpaper, a frosted menu bar, a glass Dock with app icons, windows with traffic lights. The first screen is the desktop with Marcos's 3D avatar waving in front of a blue sun; every section is an app window on the same desktop.

## World

- **Wallpaper:** `public/img/wallpaper.svg`, a light Big Sur-like landscape (sky blue to pale lavender, soft waves, peach and lilac glows), fixed behind the page (`body::before`, works on iOS) so windows scroll over it.
- **Desktop (hero):** the avatar clip (transparent WebM) stands in front of a blue sun (`accent`, soft halo) with a dashed white orbit of stack chips (white pills) and two floating code chips (xl/lg only); a frosted shelf runs edge to edge under him and the Dock rests on it. Draggable windows (`sobre.txt`, terminal, Projetos) and Finder icons on the right (xl): PDF and LOG documents, a folder, Terminal and Messages-like apps; one click (or Enter, or a tap) opens: the label turns blue and the icon pulses like an app launching. The Terminal icon reopens or restores the terminal window if it was closed or minimised, then focuses it. Below 1024px the stage stacks above the windows and the icons become an iPhone-style home screen grid (4 columns, 8 on tablets).
- **Sections:** a title widget (frosted glass, ink title, muted intro) beside the pose widget (`PoseBlock`), then the section's window.
- **Windows:** light windows are documents (about, stack, git log, projects, education); dark navy windows are shells (hero terminal, contact `zsh`).

## Tokens (`src/app/globals.css`)

| Role | Value |
|---|---|
| surface / panel / bar / line | `#eef1f6` / `#ffffff` / `#f6f7fa` / `#e1e5ec` |
| ink / muted | `#0a1120` / `#556178` |
| accent / accent-ink / accent-hi / accent-soft | `#2f5db8` / `#244a93` / `#8db2f5` / `#e6edfa` |
| ok / live / WhatsApp | `#2bb673` / `#4ade9b` / `#25d366` |

Colour roles: the wallpaper is the room; white windows are documents, navy windows (`ink-2`) are shells. Blue `accent` marks the one active or primary thing (current menu item, core stack chips, primary button, selected icon label); `ok` green is "running now" on light (HEAD), `live` green on navy. App icons are the one place for other hues: each section app has its own macOS-style squircle (`APPS` in `src/components/ui/AppIcon.tsx`).

## Hero layout and windows (latest)

- Phones: square stage, the avatar box is the bottom 80% so the sun and the whole orbit fit above it; no home-screen grid (the Dock is the navigation).
- From xl the stage centres in the free band between the left windows and the right side (`.hero-vars` in `globals.css`), sized so the orbit never runs under a window; the Projetos window and the two code chips appear from 90rem.
- Dragging (hero windows): the window lifts (scale 1.03, deeper shadow) and tilts with the pointer's speed; on desktop it is thrown with a little momentum and kept on the desktop; on touch it stretches and springs back (elastic).
- Minimise: `genieTimeline` in `src/lib/windows.ts`, sides curve in (S-shaped clip-path) towards the Dock and the window pours through the neck; restore plays it in reverse. A dragged window comes back to where it was left. Close fades and shrinks to 0.9. Section windows leave a dashed "Restaurar" outline while minimised; the desktop's own windows (sobre.txt, terminal, Projetos) leave nothing behind (on phones they also leave the flow) and come back from their Dock thumbnail, which shows on phones too.
- Stack: groups include IA (Claude, Claude Code, Skills, MCP, Agentes); Nginx, VPS Linux, Claude and Claude Code are core (blue). A second window, `monitor — vps`, lists the server security and monitoring practices with green checks.
- Footer: one glass widget with identity, contact pills, "Voltar ao topo" and the small print.

## Dark mode

- Toggle (sun/moon) in the menu bar, before PT/EN. The site always opens light: no stored choice, the system preference is ignored.
- `html[data-theme="dark"]` swaps the tokens in `globals.css` (panel, bar, line, ink, muted, surface, accent-ink/soft) and the materials: `glass` (white → `#1a2030`), `shade` (black → white, for hairlines and hovers), `rim` (glass borders), `ok-ink`, plus the night wallpaper `public/img/wallpaper-dark.svg`. `night` (`#0a1120`) stays dark in both themes for tooltips and chips; shells (`ink-2/3`) don't change.
- Switching paints the new theme in a circle growing from the toggle (View Transitions API, when available and motion is allowed).


- **Geist** for everything readable; headings semibold, tracking −0.04em, display max 60px.
- **Geist Mono** only for data and code: window titles (file names), terminal, commit hashes, paths, stack labels, dates.

## Components

- `Window` — rounded 12px, hairline border, blue-tinted shadow; title bar 38px with traffic lights on the left (red close only when the caller allows, yellow minimise, green zoom; grey when disabled, glyphs on hover) and the title centred in sans.
- `PoseBlock` — 22px-radius accent block; the pose PNG breaks out of its top edge and floats.
- Minimise = genie into the Dock (`src/lib/windows.ts`): the window's bottom pinches towards the Dock divider and it pours in; a mini window appears in the Dock and a dashed outline keeps its place on the page with "Restaurar". Zoom = full screen over a blurred desktop (double-click the title, Esc or click outside to leave). Close (hero terminal and Projetos) with "Reabrir janelas".
- `Dock` — frosted glass, app icons 44–48px, magnify around the cursor on fine pointers; an app bounces the first time its section opens and keeps a running dot; minimised windows after the divider; the PDF at the end downloads the CV. Phones show Início, Sobre, Projetos, Contato and the CV.
- `Widget` — frosted glass card (`glass` utility), 22px radius, for section titles, contact and footer.
- Menu bar — fixed 40px frosted white; the bold name is the app in front (the current section), sections as menus, availability, PT/EN, clock written like macOS ("qua., 21 de out. 18:16", Brasília time).
- Buttons — pills (accent, outline, WhatsApp green).

## Motion

- Hero: video rises in, windows open from their bottom edge in sequence, desktop icons slide in; on scroll the windows drift up at two speeds and the wallpaper eases back.
- Sections: windows open like apps launched from the Dock, the genie in reverse (rise and widen out of a pinched bottom edge, `expo.out`) while the section's Dock icon bounces; poses pop out of their block (`back.out`) and then float.
- Terminal: real commands (`ajuda`, `ls`, `projetos`, `contato`, `cv`, `whatsapp`, `whoami`, `limpar`, and `sudo contratar`).
- Desktop (lg, fine pointer): drag on empty wallpaper draws a selection rectangle that highlights the desktop icons it touches.
- Stack chips are buttons: hover or focus shows "usado em", computed from the experience and project tags.
- Projects explorer: ↑/↓/Home/End move through the list; contact window copies the e-mail.
- `prefers-reduced-motion`: no travel, video paused on its poster, all content visible.

## Assets

- `public/media/avatar-wave-alpha.webm` (+ `-poster.webp`) — Kling 2.6 image-to-video via Monid (first = last frame, seamless loop), desk cropped, white keyed out by `scripts/key-video.py --crop-bottom 0.074 --keep-center`.
- `public/media/pose-{cheer,thumbs,think}.webm` (+ posters) — Kling 2.6 via Monid from the poses on white, keyed and ping-pong looped (`--pingpong`). Played inside `PoseBlock animated`.
- `AlphaVideo` falls back to the transparent poster on WebKit/iOS (no VP9 alpha) and with reduced motion.
- `public/img/poses/*.webp` — poses from `portifolio-claude/` (files there are misnamed; mapping in git history of this change).
- `public/img/poses/point-down.webp` — from `portifolio-claude/Gemini_Generated_Image_scgzjlscgzjlscgz.jpg`, white keyed out; used with `PoseBlock reachBelow` in Projetos: the torso's flat cut sits on the block's bottom edge and the hand hangs below it, pointing at the Projetos window.
