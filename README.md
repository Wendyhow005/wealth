# Sterling & Vale Advisory

A single-page **lead-magnet landing page** for **Sterling & Vale Advisory**, a fictional wealth-management firm. The page is built around one conversion goal: get visitors to claim a free **Wealth Blueprint** via the enquiry form. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no package manager. Google Fonts is the only external dependency.

🌐 **Live site:** https://wendyhow005.github.io/wealth/

![Sterling & Vale Advisory — Free Wealth Blueprint landing page](screenshot.png)

## Features

- **Purple visual identity** — deep aubergine with an amethyst→orchid glow accent; **Fraunces** display serif paired with **Inter** body
- **Lead-magnet funnel** — offer hero → what's inside → how it works (3-step) → testimonials → capture form
- **Signature hero element** — a glowing glass "Blueprint" card that previews the free offer
- **Responsive, mobile-first design** with breakpoints at 640px, 860px, and 980px
- **Smooth-scroll navigation** with a collapsible mobile menu
- **Scroll-in reveal animations** powered by `IntersectionObserver`
- **Auto-playing testimonial carousel** with dot navigation
- **Enquiry form** that submits via AJAX (FormSubmit) without a page redirect
- **WhatsApp chat widget** — floating button with suggested-question chips and free-text compose
- **Social profile links** in the footer (LinkedIn, X, Facebook, Instagram, YouTube) as inline-SVG icons
- **Social share buttons** on the form-success state (LinkedIn, X, Facebook, email, and copy-link)
- **SEO-ready** — descriptive title/meta, canonical, full Open Graph + Twitter Card tags, `FinancialService`/`Offer` JSON-LD with `sameAs`, plus `robots.txt`, `sitemap.xml`, and an SVG favicon
- **Accessibility-conscious**: respects `prefers-reduced-motion`, semantic markup, ARIA on nav and carousel, visible focus styles

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Semantic page structure — Hero → What's inside → How it works → Testimonials → Lead form, plus SEO/social `<head>` |
| `styles.css` | All styling; theming driven by `:root` custom properties, mobile-first layout |
| `script.js` | One IIFE: navbar state, mobile menu, scroll reveals, carousel, enquiry form, footer year, WhatsApp widget, copy-link share |
| `robots.txt` / `sitemap.xml` / `favicon.svg` | Crawler directives, single-URL sitemap, and brand SVG favicon |

## Running locally

There is no build step. Open `index.html` directly in a browser, or serve it statically to avoid `file://` quirks:

```bash
python -m http.server
```

Then visit http://localhost:8000.

## Enquiry form (FormSubmit)

The form submits via **FormSubmit's AJAX endpoint** using `fetch()`, so the page never redirects.

- The endpoint is the `FORM_ENDPOINT` constant in `script.js` (look for the `REPLACE_WITH_YOUR_EMAIL` comment).
- **One-time activation:** the *first* submission to a new email address triggers a confirmation email from FormSubmit. The form only delivers messages **after** that activation link is clicked.
- Spam protection: a hidden `_honey` honeypot field plus `_captcha: "false"`.

## Deployment

The site deploys automatically to **GitHub Pages** via GitHub Actions. Every push to the `main` branch triggers the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which publishes the repository root to Pages.

To publish a change:

```bash
git add -A
git commit -m "describe your change"
git push
```

## Customization

- **Colors & spacing:** edit the custom properties in `:root` at the top of `styles.css`
- **Enquiry form email:** update `FORM_ENDPOINT` in `script.js`
- **Testimonials:** add or remove `<li class="slide">` items in `index.html` — the carousel dots and timing update automatically

## License

This is a demonstration project for a fictional company.
