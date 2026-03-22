# Portfolio Frontend

Personal portfolio website built with Vue 3, TypeScript, and Vite. Includes a public landing page and an admin panel for managing projects, users, visits, and CV.

## Requirements

- **Node.js** >= 18
- **npm** >= 9
- **Backend API** running (see environment variables)

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vue Router 4
- Axios
- Vite 5
- Vitest (testing)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/matymatyyy/portafolio-frontend.git
cd portafolio-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and adjust the values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_APP_NAME` | Application name (used in page titles) | `Portfolio` |

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

API requests to `/api` are automatically proxied to `VITE_API_URL`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run tests with Vitest |

## Project Structure

```
src/
├── assets/styles/     # Global CSS
├── components/common/ # Reusable components (Button, Input, Spinner, Pagination)
├── components/users/  # User-specific components
├── composables/       # Vue composables (useAuth, useProjects, etc.)
├── pages/             # Page components
│   ├── admin/         # Admin panel pages
│   └── users/         # User management pages
├── router/            # Vue Router config and guards
├── services/          # API service modules
├── types/             # TypeScript interfaces
├── utils/             # Axios instance and helpers
└── tests/             # Unit tests
```

## Building for Production

```bash
npm run build
```

Output is generated in the `dist/` directory, ready to be served by any static file server.
