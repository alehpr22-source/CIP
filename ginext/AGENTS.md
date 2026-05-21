# AGENTS.md

## Stack

- **Next.js 16** (App Router, RSC) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (PostCSS plugin `@tailwindcss/postcss`)
- **shadcn/ui** (new-york style, `components.json` at root)
- **Supabase** (auth + DB via `@supabase/ssr` for middleware/server, `@supabase/supabase-js` for client)
- **pnpm** (lockfile: `pnpm-lock.yaml`; workspace config allows native builds for prisma/sharp)
- **Framer Motion** for animations, **Lucide** for icons

## Commands

```
pnpm dev       # dev server
pnpm build     # production build
pnpm start     # serve production build
pnpm lint      # ESLint (eslint-config-next core-web-vitals + typescript)
```

No test framework is configured. No CI workflows exist.

## Architecture

### Route groups (parenthesized = no URL segment)

- `app/(public)/` — login, register, landing page. No auth required.
- `app/(dashboard)/` — `/dashboard` and `/admin`. Protected routes.

### Auth flow

- **Middleware** (`app/middleware.ts`) uses `@supabase/ssr` cookie-based client.
  - Authenticated users hitting `/login` or `/register` → redirect to `/dashboard`.
  - Unauthenticated users hitting `/dashboard` or `/admin` → redirect to `/login`.
  - Matcher excludes `_next/static`, `_next/image`, `favicon.ico`.
- **Client auth** lives in `hooks/useAuth.tsx` — `AuthProvider` wraps the app in `app/layout.tsx`.
  - `useAuth()` hook provides `user`, `session`, `usuario` (DB row), `signUp`, `signIn`, `signOut`, `refreshUsuario`.
  - Registration validates DNI against a **mock RENIEC service** (`lib/services/reniec.ts`) — not a real API. Mock data for DNIs `12345678` and `87654321`; any other 8-digit DNI returns a default name.

### Supabase

- Client singleton: `lib/supabase.ts` — typed with a full `Database` schema.
- Tables: `usuarios`, `solicitudes`, `documentos`, `observaciones`, `colegiados`, `carnets`, `contador_carrera`, `pagos`, `meses_adeudados`.
- Type aliases exported: `UsuarioRow`, `SolicitudInsert`, etc.
- Env vars required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.local`).
- Migrations live in `supabase/migrations/`.

### Path alias

- `@/*` maps to root (configured in `tsconfig.json`). Use `@/components`, `@/lib`, `@/hooks`.

### Conventions

- Services layer in `lib/services/` (solicitudes, documentos, observaciones, reniec).
- UI components in `components/`; shadcn primitives in `components/ui/`.
- Hooks barrel export from `hooks/index.ts`.
- Spanish naming throughout (domain, variables, UI text).
