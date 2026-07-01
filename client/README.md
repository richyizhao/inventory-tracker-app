# Frontend Project Structure
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
│  │  ├─ custom/               # Shared app-specific components
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

## Feature module pattern

Most folders inside `src/features` follow a feature-based structure like:

```text
products/
├─ api/           # API request functions
├─ components/    # Feature UI pieces
├─ hooks/         # Feature-specific hooks
├─ lib/           # Helpers, mappers, events, form utilities
└─ types/         # Feature-local types
```
