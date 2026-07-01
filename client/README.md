## Client Tech Stack

- TypeScript
- React 19
- TanStack
- Tailwind CSS
- Shadcn/ui
- Vite

## Run Locally

```bash
npm install
npm run dev
```

The client uses `http://localhost:3000`.

## Configuration

The client reads Vite environment variables such as.

- `VITE_API_BASE_URL`: base URL for the backend API

## Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally
- `npm run test`: run frontend tests
- `npm run lint`: run ESLint
- `npm run format`: format source files with Prettier
- `npm run check`: check formatting with Prettier
- `npm run typecheck`: run the TypeScript type checker

## Folder Structure

```text
client/
├─ src/
│  ├─ app/
│  │  ├─ routes/               # TanStack Router route files
│  │  ├─ app.tsx               # App root
│  │  ├─ router.tsx            # Router setup
│  │  └─ routeTree.gen.ts      # Generated route tree
│  ├─ assets/                  # Static images and frontend assets
│  ├─ components/
│  │  ├─ common/               # Shared app-specific components
│  │  ├─ layout/               # Sidebar, nav, and layout components
│  │  ├─ ui/                   # shadcn/ui primitives
│  │  └─ theme-shortcut.tsx    # Theme shortcut helper
│  ├─ config/
│  │  ├─ .env                  # Client environment values
│  │  └─ app-config.ts         # Shared frontend constants
│  ├─ features/                # Feature-based modules
│  │  ├─ analytics/
│  │  ├─ auth/
│  │  ├─ categories/
│  │  ├─ dashboard/
│  │  ├─ products/
│  │  ├─ roles/
│  │  ├─ settings/
│  │  ├─ transactions/
│  │  └─ users/
│  ├─ hooks/                   # Reusable global hooks
│  ├─ lib/                     # Shared utilities, formatters, API helpers
│  ├─ styles/                  # Global styles
│  └─ types/                   # Shared app-wide types
└─ README.md
```

## Architecture Notes

The frontend is organized by feature. Shared UI primitives live under `components/ui`, while reusable app-specific pieces live under `components/custom` and `components/layout`.

Most folders inside `src/features` follow a feature-based structure like:

```text
products/
├─ api/           # API request functions
├─ components/    # Feature UI pieces
├─ hooks/         # Feature-specific hooks
├─ lib/           # Helpers, mappers, events, form utilities
└─ types/         # Feature-local types
```

## Deployment

The production client is built into a Docker image. During deployment, GitHub Actions passes `VITE_API_BASE_URL` at build time and publishes the image to Azure Container Registry before updating the frontend Container App.
