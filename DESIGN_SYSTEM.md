# Kira Tech MFA Design System

This document is the working design-system reference for integrating Figma designs into this repository. Use it as the source of truth before generating UI from Figma MCP output.

## Product Direction

Kira Tech MFA is a compact utility app for 2FA codes, IP checks, and domain lookup. The interface should feel secure, calm, technical, and fast. The primary color is green. Avoid generic blue or purple SaaS styling.

Core principles:
- Green is the only accent color.
- Use high-contrast sans-serif and mono typography.
- Favor functional density with breathable spacing.
- Keep card controls tactile but quiet.
- Dark mode must be first-class.

## Token Definitions

Tokens are CSS custom properties in `src/App.css` and theme overrides in `src/key-display.css`.

Base dark tokens:

```css
:root {
  --bg: #111514;
  --surface: #18211d;
  --surface-2: #1b2821;
  --line: #33423a;
  --text: #f1f5f2;
  --muted: #94a39a;
  --accent: #69cc92;
  --danger: #f0aca4;
}
```

Light mode tokens:

```css
.board-page.light {
  --bg: #f4f7f4;
  --surface: #ffffff;
  --surface-2: #f7fbf8;
  --line: #d4dfd6;
  --text: #152019;
  --muted: #607066;
  --accent: #27834e;
  --accent-soft: #e2f2e7;
  --danger: #b63d36;
}
```

Use these semantic tokens in new CSS:
- `--bg`: page background
- `--surface`: cards, panels, inputs
- `--surface-2`: secondary panels and grouped surfaces
- `--line`: borders and dividers
- `--text`: primary readable text
- `--muted`: secondary labels and helper text
- `--accent`: primary green actions, active states, icons
- `--accent-soft`: light green backgrounds
- `--danger`: destructive and error states

Do not introduce raw one-off colors unless the value is a carefully scoped dark or light mode override. Prefer `color-mix()` with existing tokens.

## Typography

The app uses Geist via `@fontsource-variable/geist`. Technical values use `JetBrains Mono` in CSS.

Patterns:

```css
.board-heading h1 {
  font-size: 30px;
  line-height: 1;
  letter-spacing: -.055em;
}

.batch-input {
  font: 12px/1.65 "JetBrains Mono", monospace;
}

.code-button output {
  font: 700 clamp(26px, 4vw, 42px)/1 "JetBrains Mono", monospace;
  letter-spacing: -.075em;
}
```

Typography rules:
- Use Geist for UI labels, buttons, and headings.
- Use `JetBrains Mono` for secrets, IPs, TOTP codes, and technical values.
- Avoid serif fonts.
- Keep labels small and uppercase only for technical section headers.

## Component Library

Reusable shadcn/Base UI components live in `@/components/ui`:
- `@/components/ui/button.tsx`
- `@/components/ui/input.tsx`
- `@/components/ui/textarea.tsx`
- `@/components/ui/dialog.tsx`
- `@/components/ui/switch.tsx`

This repo uses shadcn style `base-nova` with Base UI primitives. See `components.json`.

Button pattern:

```tsx
import { Button } from "@/components/ui/button"

<Button className="add-codes primary-action">
  Lấy mã 2FA
</Button>
```

Switch pattern:

```tsx
import { Switch } from "@/components/ui/switch"

<Switch checked={rememberKeys} onCheckedChange={setRememberKeys} />
```

Lazy UI registry components live in `src/components/lazy-ui`:
- `src/components/lazy-ui/copy-button/copy-button.tsx`
- `src/components/lazy-ui/animate-tooltip/animate-tooltip.tsx`
- `src/components/lazy-ui/reveal-animate/reveal-animate.tsx`

Copy button pattern:

```tsx
import { CopyButton } from "./components/lazy-ui/copy-button"

<CopyButton
  content={code}
  text
  variant="outline"
  label="Copy mã"
  copiedLabel="Đã copy"
  revealAnimate={false}
  iconAnimate="reveal"
  className="code-copy-button"
/>
```

Most feature components are currently colocated in `src/App.tsx`:
- `App`
- `TotpCard`
- `InfoCard`
- `DeviceLocationCard`
- `IpReport`

When adding larger features, extract leaf components into `src/components/<feature>/` instead of making `App.tsx` larger.

## Frameworks And Libraries

Stack:
- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4 via `@tailwindcss/vite`
- shadcn CLI components
- Base UI primitives
- Phosphor Icons
- Lazy UI registry components
- `otpauth` for TOTP generation
- `vite-plugin-pwa` for PWA support
- `motion` and `radix-ui` as Lazy UI dependencies

Scripts from `package.json`:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

Vite config uses:
- React plugin
- Tailwind Vite plugin
- PWA plugin
- Local API middleware for IP/domain tools
- Alias `@` mapped to the root `@` directory, not `src`

Important import rule:
- `@/components/ui/*` resolves to `@/components/ui`
- Lazy UI components under `src/components/lazy-ui` should use relative imports or local `src` imports, not `@/components/lazy-ui/*`

## Asset Management

Static app assets live in `public`. Current visible asset:
- `public/icons.svg`

The PWA manifest in `vite.config.ts` references `/kira.jpeg` as the install icon:

```ts
VitePWA({
  includeAssets: ["kira.jpeg"],
  manifest: {
    name: "Kira Tech 2FA",
    short_name: "Kira 2FA",
    theme_color: "#27834e",
    background_color: "#f7faf7"
  }
})
```

Rules:
- Put browser/PWA/static public files in `public`.
- Put imported React assets in `src/assets`.
- Prefer SVG for UI glyphs and JPEG/WebP for brand imagery.
- Keep PWA icons at 512x512 where possible.

## Icon System

Primary app icons use `@phosphor-icons/react`, imported directly in `src/App.tsx`:

```tsx
import { ShieldCheck, Key, Copy, X } from "@phosphor-icons/react"
```

Icon rules:
- Use Phosphor Icons for app-level icons.
- Use `weight="fill"` only for status/brand badges.
- Use outline icons for actions and navigation.
- Keep icon sizes in the 14-22px range for utility UI.
- Do not use emoji in UI.

Note: `components.json` declares shadcn `iconLibrary: "lucide"`, but the actual app UI standard is Phosphor. Do not introduce new Lucide icons unless they are part of an installed registry component.

## Styling Approach

Styling is global CSS:
- `src/App.css`: compact base layout and early app styles
- `src/key-display.css`: app-specific overrides, theme fixes, TOTP/IP/domain UI, responsive rules
- `src/index.css`: Tailwind entry and shadcn variables if present

CSS methodology:
- Global classes
- CSS custom properties for theme tokens
- `!important` overrides where shadcn/Base UI or registry classes need correction
- CSS Grid for card lists and responsive layout
- CSS keyframes for subtle entry animation

Responsive pattern:

```css
@media (max-width: 760px) {
  .code-grid { grid-template-columns: 1fr; }
  .composer { grid-template-columns: 1fr; }
  .ip-grid { grid-template-columns: 1fr; }
}
```

Layout rules:
- Use `width:min(100% - 40px,980px)` for main content shells.
- Keep mobile single-column under 760px.
- Use grid for feature cards and data panels.
- Avoid fixed heights for content-heavy cards.

## Project Structure

Current structure:

```text
.
├── @/
│   ├── components/ui/      # shadcn/Base UI components
│   └── lib/utils.ts        # cn utility
├── api/                    # Vercel/serverless-style API files
├── public/                 # static assets
├── src/
│   ├── App.tsx             # main SPA and feature components
│   ├── App.css             # base styles
│   ├── key-display.css     # feature/theme styles
│   ├── components/lazy-ui/ # Lazy UI registry components
│   ├── components/ui/      # Lazy UI tooltip helper
│   ├── lib/                # Lazy UI helper
│   └── main.tsx
├── components.json
├── package.json
└── vite.config.ts
```

Feature organization guidance:
- Keep tiny helper components in `src/App.tsx` only if they are tightly coupled to one screen.
- Move reusable or growing feature components into `src/components/<feature>/`.
- Keep shadcn components in `@/components/ui`.
- Keep third-party registry components in their generated location unless import aliases require adjustment.

## Figma MCP Integration Rules

When translating Figma designs:

1. Map Figma colors to semantic tokens, not raw hex values.
   - Green primary maps to `--accent`.
   - Page backgrounds map to `--bg`.
   - Cards map to `--surface`.
   - Borders map to `--line`.

2. Preserve the app's utility-product tone.
   - Avoid decorative gradients unless subtle background atmosphere is needed.
   - Avoid purple/blue accent systems.
   - Do not add generic dashboard card bloat.

3. Use existing components first.
   - Actions: `Button`
   - Text input: `Input`
   - Multi-line input: `Textarea`
   - Persistence toggle: `Switch`
   - Copy action: `CopyButton`

4. Respect current card behavior.
   - TOTP cards should show identity once.
   - Countdown ring is the only expiry indicator.
   - Email editing uses read/edit mode.
   - Copy and delete controls must support light and dark mode.

5. Implement dark mode at the same time as light mode.
   - Check label contrast.
   - Check input placeholder contrast.
   - Check icon button hover states.
   - Avoid pure black.

6. Keep interaction cycles complete.
   - Loading, empty, and error states should remain visible.
   - Buttons should have hover and active states.
   - Editable card fields should support keyboard save/cancel.

## Known Gaps

- Tokens are not centralized in a dedicated token file.
- There is no Storybook or component documentation site.
- `src/App.css` is minified/compact, so prefer adding readable overrides to `src/key-display.css`.
- Some shadcn aliases point at the root `@` directory while Lazy UI files are under `src`; be careful with imports.

