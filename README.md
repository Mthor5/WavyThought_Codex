# WavyThought_Codex

WavyThought_Codex is the living landing page for WavyThought's creative studio. It pairs a bold hero image and logo moment with a centered contact form that collects the name, email, project message, and mailing-list opt-in before emailing the team at `info@wavythought.com`. The goal is to deliver a clean, modern, tech-forward first impression while making it effortless for prospects to reach out.

## Features
- Immersive hero section with a responsive backdrop and centered WavyThought logo.
- Accessible contact form with inline validation, placeholders that describe each required field, and success/error messaging.
- Mailing-list opt-in checkbox for updates, promotions, and future launches.
- Express + Nodemailer API endpoint that relays submissions to your inbox with reply-to support.
- Tailwind-powered styling that keeps all content center-aligned for a cohesive layout.

## Getting Started
1. **Install dependencies:** `npm install`
2. **Configure environment:** Duplicate `.env.example` to `.env` and add your SMTP host, port, username, password, and optional `CLIENT_ORIGIN`.
3. **Run the backend:** `npm run dev:server` (defaults to `http://localhost:4000`)
4. **Run the frontend:** In another terminal, `npm run dev` and open the provided Vite URL (usually `http://localhost:5173`).
5. **Build for production (optional):** `npm run build`

## Controls
- Enter your **Name**, **Email address**, and **Message** in the labeled, centered inputs.
- Toggle the **"Sign me up for updates"** checkbox if you want to join the mailing list.
- Click the **Send** button to dispatch the details to the team; the button confirms sending state and reports success or errors directly beneath it.
