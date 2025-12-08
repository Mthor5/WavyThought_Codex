# WavyThought_Codex

WavyThought_Codex is the living landing page for WavyThought's creative studio. It pairs a bold hero image and logo moment with a centered contact form that collects the name, email, project message, and mailing-list opt-in before emailing the team at `info@wavythought.com`. The goal is to deliver a clean, modern, tech-forward first impression while making it effortless for prospects to reach out.

## Features
- Immersive hero section with a responsive backdrop, frosted-glass wordmark plaque, and warm animated blurs.
- Lights Off toggle that swaps the site into a warm, dark presentation layer (contact form, footer, and typography update automatically).
- Sculptural 3D hero model with lighting tuned to the gradient palette and cursor-reactive motion.
- Work carousel with a glass-tile treatment, hover zoom, “See All” modal grid, and full-screen lightbox viewer.
- Accessible contact form with inline validation, frosted inputs for both themes, and a mailing-list opt-in smile-button control.
- Web3Forms-powered contact form with an automatic Express + Nodemailer fallback whenever a Web3Forms access key is not provided.
- Tailwind-powered styling that keeps all content center-aligned for a cohesive layout.

## Getting Started
1. **Install dependencies:** `npm install`
2. **Configure environment:** Duplicate `.env.example` to `.env`, replace the default public `VITE_WEB3FORMS_ACCESS_KEY` with your personal key from [web3forms.com](https://web3forms.com/), optionally set `VITE_CONTACT_ENDPOINT` (e.g. `http://localhost:4000/api/contact`) if you plan to rely on the backend relay, and fill in SMTP credentials for that relay.
3. **Run the backend:** `npm run dev:server` (defaults to `http://localhost:4000`)
4. **Run the frontend:** In another terminal, `npm run dev` and open the provided Vite URL (usually `http://localhost:5173`).
5. **Build for production (optional):** `npm run build`

## Controls
- Enter your **Name**, **Email address**, and **Message** in the labeled, centered inputs.
- Toggle the **"Sign me up for updates"** checkbox if you want to join the mailing list.
- Click the **Send** button to dispatch the details to the team; the button confirms sending state and reports success or errors directly beneath it.

## Deployment
### Local Preview & Build
1. Install dependencies with `npm install`.
2. Build the site using `npm run build`. The production assets are emitted to the `dist` directory.
3. Preview the build locally with `npm run preview` (Vite serves `dist` on a temporary local port).

### GitHub Pages
- Live demo: [https://mthor5.github.io/WavyThought_Codex/](https://mthor5.github.io/WavyThought_Codex/)
- Steps to deploy:
  1. Run `npm run build` to generate the latest static assets inside `dist`.
  2. Commit the contents of `dist` to a `gh-pages` branch (you can automate with the `gh-pages` npm package: `npx gh-pages -d dist`).
  3. In the GitHub repository settings, enable GitHub Pages and point it to the `gh-pages` branch (or `/root`).
  4. Wait for GitHub Pages to finish publishing, then hit the live URL above to confirm the deployment.
