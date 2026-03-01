---
name: frontend-design
description: Create clean, corporate-quality informational UI — structured, readable, and trustworthy. Modelled after professional brand communication pages like IBM, Microsoft, and enterprise product sites. Use this skill when building informational pages, guides, alerts, policy pages, onboarding flows, FAQ layouts, or any UI that communicates important structured content clearly and professionally.
license: Complete terms in LICENSE.txt
---

This skill guides creation of clean, corporate-quality informational interfaces. The reference aesthetic is professional enterprise UI — think IBM, Google, Microsoft documentation pages — structured, scannable, and trustworthy. Content is the hero; design serves communication.

The user provides content requirements: a guide, policy page, informational card layout, alert page, onboarding screen, or similar structured communication UI.

---

## Design Thinking

Before coding, analyze the content and structure:
- **Purpose**: Is this an alert, a guide, a policy, a checklist, an explainer? What action or understanding should the user leave with?
- **Tone**: Professional, warm, and authoritative. Clear without being cold. Helpful without being casual.
- **Audience**: General public, employees, customers — people who need to trust the information quickly.
- **Structure**: Break content into a header/hero, an intro paragraph, a set of icon-card rows for key points, and a closing call-to-action.

**CRITICAL**: This is editorial, informational design. Hierarchy is everything. Users scan before they read. Every section must be immediately parseable at a glance.

---

## Layout Architecture

Build every informational UI using this proven structure:

### 1. Hero / Header Band
- Solid, saturated background color (primary brand blue, teal, or deep tone)
- Large, confident heading (2–3 lines max) left-aligned or center-aligned
- Optional: decorative icon grid or abstract shape cluster in the top-right corner as visual interest
- Padding: generous top and bottom (48–64px)
- The header sets the topic — it should be instantly readable

### 2. Intro / Context Section
- White or very light gray background
- 1–2 short paragraphs explaining the "why" of the page
- Use **inline bold** (`<strong>`) to highlight the 3–5 most critical phrases per paragraph — not whole sentences, just key terms and phrases
- Font size: 16–18px, generous line-height (1.65–1.75)
- Padding: 32–48px horizontal, 40px vertical

### 3. Icon-Card Row List
- The core of the layout: a vertical stack of cards, each with:
  - A **colored square icon block** on the left (80–100px, rounded corners ~8–12px)
  - The icon itself: simple line-art SVG or icon font glyph in a slightly darker shade of the block color
  - Each card uses a **distinct pastel/muted accent color** for its icon block (e.g. soft blue, blush pink, sage green, warm peach, lavender) — never the same color twice in a row
  - Body text on the right: 1–3 sentences, with **inline bold** on the key terms
  - Cards are separated by generous spacing (24–32px gap), not borders
  - Card background: white or very light (no heavy card borders — let whitespace define boundaries)
- This pattern makes information immediately scannable and memorable

### 4. Closing Copy + CTA
- 1–2 closing sentences reinforcing the message
- An inline hyperlink or "learn more" text link styled in the primary brand color
- A solid primary-color CTA button (full-width on mobile, centered on desktop)
- Button: rounded (6–8px), solid fill, medium weight label, comfortable padding (14px 32px)

---

## Visual Design System

### Color
- **Primary**: One confident brand color (IBM blue `#1d70db`, teal `#0f7b6c`, deep indigo `#3d3d8f`, etc.) — used for the hero background, links, and buttons
- **Icon block palette**: 4–6 distinct pastel tints, each derived from a different hue (blue-50, pink-50, green-50, peach-50, purple-50). Keep saturation low and lightness high (~90–95% lightness in HSL)
- **Body background**: `#ffffff` or `#f8f9fb` (barely-there warm gray)
- **Text**: Near-black `#1a1a2e` or `#222` for body, `#555` for secondary/caption text
- **Bold callouts**: Inherit body color — bold weight (700) is the emphasis, not color change
- Use CSS custom properties for all color tokens

### Typography
- Choose clean, professional sans-serif fonts — NOT Arial or system-ui
- Good choices: `IBM Plex Sans`, `DM Sans`, `Plus Jakarta Sans`, `Sora`, `Geist`, `Nunito`, `Source Sans 3`
- Heading: 28–40px, font-weight 700–800, tight letter-spacing (-0.02em)
- Body: 15–17px, font-weight 400, line-height 1.65
- Bold callout (inline `<strong>`): font-weight 700, same size as body
- Typographic scale: 13 / 15 / 17 / 22 / 30 / 40px — stick to this scale strictly

### Spacing & Rhythm
- Base unit: 8px grid
- Section padding: 40–64px vertical, 24–40px horizontal
- Icon block to text gap: 20–24px
- Between icon-card rows: 28–36px
- Max content width: 640–720px, centered
- Mobile: full-width with 20–24px horizontal padding

### Shadows & Depth
- Minimal shadows. If used: `box-shadow: 0 2px 12px rgba(0,0,0,0.06)` — barely visible
- No card borders unless extremely subtle (1px, `rgba(0,0,0,0.07)`)
- Hero section may use a subtle bottom gradient fade into the body background

---

## Animation Guidelines

Include smooth, purposeful animations that enhance readability without distraction:

- **Page load**: Staggered fade-in + slight upward translate on the intro section and each icon card (e.g., `opacity: 0 to 1`, `translateY(16px) to 0`), with `animation-delay` incrementing by 80–100ms per card
- **Hero entrance**: Heading slides in from left or fades up on load (300ms ease-out)
- **Card hover**: Subtle lift — `translateY(-2px)` + very soft shadow increase (200ms ease)
- **Button hover**: Slight darken + `translateY(-1px)` (150ms ease)
- **Links**: Underline animation (width transition from 0 to 100%) on hover
- Keep all durations between 150ms–350ms. Nothing should feel slow or theatrical.
- Use `prefers-reduced-motion` media query to disable animations for accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icon Block Color Palette Reference

Use this as a starting point and vary hues as needed:

```css
--icon-blue:   hsl(213, 80%, 92%);   /* soft sky blue */
--icon-pink:   hsl(340, 70%, 92%);   /* blush rose */
--icon-green:  hsl(160, 55%, 88%);   /* sage mint */
--icon-peach:  hsl(25,  80%, 91%);   /* warm peach */
--icon-purple: hsl(265, 55%, 91%);   /* soft lavender */
--icon-teal:   hsl(185, 60%, 88%);   /* aqua teal */
```

Icon stroke color: use the same hue at ~45% lightness (much darker than the block) for clear contrast.

---

## What to NEVER Do

- Do not use generic system fonts (Arial, Helvetica, system-ui) as the primary face
- Do not use heavy card borders or thick dividers — whitespace creates separation
- Do not use dark backgrounds for the body/content area — the hero is the only dark section
- Do not use full-sentence bolding — only 2–5 key words or phrases per paragraph
- Do not use more than 6 distinct colors — palette discipline is what makes this look professional
- Do not skip the icon color variety — each card MUST have a different icon block color
- Do not use flashy or theatrical animations — every motion should feel natural and helpful
- Do not center-align body text — left-aligned prose is more readable and professional

---

## Output Quality Standard

The final UI should feel like it was produced by a professional brand design team at an enterprise company. A user should be able to:
1. Understand the topic in under 3 seconds (hero heading)
2. Grasp the 3 key points in under 15 seconds (icon cards)
3. Know exactly what to do next (CTA)

Every pixel should communicate trust, clarity, and care.