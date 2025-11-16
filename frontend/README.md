# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Clerk (Auth) — local development

This project uses Clerk for authentication. The client needs a publishable key available at build time as an environment variable named `VITE_CLERK_PUBLISHABLE_KEY`.

To run the app locally with Clerk features:

1. Create a file named `.env.local` in the `frontend` folder (this file is ignored by git by default).

2. Add your publishable key to `.env.local`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YourPublishableKeyHere
```

3. Restart the dev server:

```bash
npm run dev
```

If you don't set this variable, the dev build will show a clear notice explaining how to add the key instead of crashing when Clerk components are present.
