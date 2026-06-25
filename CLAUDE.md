# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page **lead-magnet landing page** for a fictional wealth-management firm, **Sterling & Vale Advisory**. The page is built around one conversion goal: get visitors to claim a free "Wealth Blueprint" via the enquiry form. Built with **vanilla HTML/CSS/JS only** — no frameworks, no build tools, no package manager. Google Fonts is the only external dependency (loaded via `<link>` in `index.html`).

The visual identity is a **purple theme** (deep aubergine + amethyst→orchid glow accents) with **Fraunces** (display serif) paired with **Inter** (body). All color/spacing lives in `:root` custom properties in `styles.css` — retheme there, never in individual rules.

## Running

There is no build step. Open `index.html` directly in a browser, or serve statically to avoid `file://` quirks:

```
python -m http.server
```

Then visit http://localhost:8000. There are no tests, linters, or CI.

## Architecture

Three files, strictly separated by concern — keep them that way (no inline `<style>`/`<script>`):

- `index.html` — semantic structure, plus SEO/social `<head>` (descriptive title, meta description, canonical, Open Graph, and a `FinancialService`/`Offer` JSON-LD block). Sections run as a conversion funnel: Hero offer (`#home`) → What's inside (`#about`) → How it works (`#how`, a real 3-step sequence — numbered markers are justified here) → Testimonials (`#testimonials`) → Lead form (`#contact`). Each `id` is a smooth-scroll anchor used by the navbar.
- `styles.css` — all theming flows from `:root` custom properties (colors, spacing scale `--sp-1..6`, `--radius`, `--maxw`, `--nav-h`). Change the palette/spacing there, not in individual rules. Mobile-first; breakpoints at 640px, 860px (nav collapse), and 980px.
- `script.js` — one IIFE with five numbered sections: (1) navbar scrolled-state + mobile toggle, (2) IntersectionObserver scroll-in reveals, (3) testimonial carousel, (4) enquiry form + FormSubmit AJAX, (5) footer year.

### Cross-file contracts (editing one file usually means touching another)

- **Reveal animations**: any element with class `reveal` starts hidden and gets `.in-view` added when scrolled into view (`script.js` §2 ↔ `styles.css` `.reveal`). Add `reveal` to new elements you want animated.
- **Carousel**: JS builds the dot buttons from the slide count and toggles `aria-selected`; CSS animates via `translateX` on `.carousel__track`. Adding/removing a testimonial `<li class="slide">` in HTML automatically updates dots and timing — no JS change needed.
- **Navbar mobile menu**: JS toggles `.open` on `#nav-menu` and `aria-expanded` on `#nav-toggle`; the panel styling lives behind the `max-width: 860px` media query.
- **Accessibility / reduced motion**: animations are disabled both in CSS (`prefers-reduced-motion`) and JS (carousel autoplay + reveals skip). Preserve both paths when changing motion.

### Enquiry form

Submits as JSON via `fetch()` to FormSubmit's AJAX endpoint so the page never redirects. The endpoint is the constant `FORM_ENDPOINT` in `script.js` §4 (marked with a `REPLACE_WITH_YOUR_EMAIL` comment; currently `wendy.how@redbeaconam.com`). Client-side validation runs before sending; on success the form is hidden and `#form-success` is shown. The hidden `_honey` honeypot and `_captcha:"false"` / `_template:"table"` helper fields are required by FormSubmit and must stay in the payload.

**FormSubmit activation**: the first submission to any new email address triggers a one-time confirmation email; the form only delivers after that link is clicked. Note this when changing `FORM_ENDPOINT`.
