# Sterling & Vale Advisory — One-Page Website

A polished, responsive one-page investment advisory site built with **vanilla HTML, CSS, and
JavaScript** (no frameworks, no build tools). Google Fonts is the only external dependency.

## Files
- `index.html` — page structure and content
- `styles.css` — theming via `:root` custom properties, mobile-first responsive layout
- `script.js` — sticky nav, mobile menu, testimonial carousel, scroll-in animations, form AJAX

## Run locally
Just open `index.html` in your browser — no server required.

Optionally, serve it (avoids any browser file:// quirks):
```
python -m http.server
```
Then visit http://localhost:8000

## Enquiry form (FormSubmit)
The form submits via **FormSubmit's AJAX endpoint** using `fetch()`, so the page never redirects.

- Endpoint is set in `script.js` → `FORM_ENDPOINT` (look for the `REPLACE_WITH_YOUR_EMAIL`
  comment). It is currently set to `wendy.how@redbeaconam.com`.
- **One-time activation:** the *first* submission to a new email address triggers a confirmation
  email from FormSubmit. The form only delivers messages **after** you click that activation link.
- Spam protection: a hidden `_honey` honeypot field plus `_captcha: "false"`.

## Notes
- Accessible labels on all inputs, ARIA on nav and carousel, visible focus styles.
- Respects `prefers-reduced-motion`.
- No console errors.
