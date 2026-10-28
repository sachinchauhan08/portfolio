# Cinematic Portfolio

A modern personal portfolio built with Next.js 16, GSAP, and Three.js to deliver a cinematic, high-performance web experience with smooth motion and immersive visuals.

## Features

- Immersive hero section with layered 3D and motion effects
- Smooth GSAP-powered scroll transitions
- Responsive portfolio sections for work, projects, and experience
- Modular CSS architecture with CSS Modules
- Content-driven setup using JSON data files
- Lightweight and production-ready Next.js structure

## Tech Stack

- Next.js 16
- React 19
- GSAP
- Three.js
- CSS Modules
- ESLint

## Project Structure

```text
.
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── sections/
│   ├── three/
│   └── ui/
├── data/
│   ├── content.json
│   └── profile.json
├── lib/
├── public/
│   └── assets/
├── styles/
├── package.json
├── next.config.mjs
├── jsconfig.json
├── README.md
├── .gitignore
└── package-lock.json
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

4. Configure public site and contact details:

```powershell
Copy-Item .env.example .env.local
```

Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`,
`NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_GITHUB_URL`, and
`NEXT_PUBLIC_LINKEDIN_URL` in `.env.local` and in your deployment provider's
environment settings. `NEXT_PUBLIC_CONTACT_PHONE` overrides the phone number
in `data/profile.json`; use an international format such as `+1...` or
`+91...`. Values with the `NEXT_PUBLIC_` prefix are included in the client
bundle and are visible to website visitors. Restart the development server
after changing them.

## Available Scripts

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Run production build locally
npm run lint   # Lint project files
```

## Customizing the Portfolio

Update your personal content in:

- `data/profile.json` for profile details, roles, social links, and experience
- `data/content.json` for section text and hero/footer content
- `public/assets` for images and media

## Deployment

This project is ready for deployment on platforms such as:

- Vercel
- Netlify
- Any Node.js-compatible hosting provider

For Vercel, the easiest setup is to connect the repository and deploy automatically.

## Notes

This project is designed as a personal portfolio template and can be easily adapted to your own brand, content, and portfolio details.

## License

This project is provided for personal and portfolio use. Update or reuse as needed for your own website.
