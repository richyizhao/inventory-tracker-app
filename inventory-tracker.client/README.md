# Frontend Architecture

The codebase follows a feature-first structure.

- `src/app`: application shell, routing, and top-level providers
- `src/features`: feature modules containing feature-specific pages, hooks, and API logic
- `src/components`: reusable shared UI and layout components
- `src/lib`: shared libraries such as authentication, HTTP utilities, and validation
- `src/config`: global configuration and permission definitions
- `src/assets`, `src/styles`, `src/hooks`, `src/utils`, `src/types`: shared supporting modules

Path aliases are configured so `@/` resolves to `src/`.

## Getting Started

### Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

### Build

Create a production build with:

```bash
npm run build
```

Preview the production bundle locally with:

```bash
npm run preview
```

### Unit Testing

The current test suite covers frontend logic such as authentication API behavior and auth provider flows.

Run Vitest in watch mode during development:

```bash
npm test
```

Run the unit test suite once:

```bash
npm run test:unit
```

### E2E Testing

The setup uses the app's Settings page to generate demo data before the browser tests run.

Install browser dependencies:

```bash
npx playwright install chromium
```

Run the full Chromium suite:

```bash
npm run test:e2e -- --project=chromium
```

Useful variants:

```bash
npm run test:e2e -- --project=chromium e2e/test/login.spec.ts
npm run test:e2e:headed
npm run test:e2e:ui
```

## Functional Scope

- Authentication and session handling
- Dashboard and analytics views
- Product management
- Category and subcategory management
- Transaction entry and transaction history
- User and role management
- Settings and demo-data workflows used for local development and end-to-end testing

## Key Design Decisions

- Feature modules group related UI, hooks, and API calls to improve scalability.
- Shared authentication state was moved into `src/lib/auth` so features do not depend directly on one another.
- Shared UI components remain centralized in `src/components` to encourage reuse and consistency.
