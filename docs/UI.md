Fix Tailwind CSS not applying in my Next.js 13+ App Router project.

1. Ensure `globals.css` exists and has `@tailwind base`, `components`, `utilities`.
2. Ensure it's imported in `src/app/layout.tsx` via `import './globals.css'`
3. Check `tailwind.config.ts` content includes `./app/**/*.{js,ts,jsx,tsx}` and `./src/**/*`
4. Confirm PostCSS config is correct
5. Restart the dev server

File tree: Tailwind CSS is installed. App structure follows `/app/` routing.
