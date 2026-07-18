# Support Ticket System — Backend

Node.js backend with TypeScript, Express, MongoDB, ESLint, Prettier, Husky, and lint-staged.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm
- MongoDB

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and adjust values as needed:

   ```bash
   cp .env.example .env
   ```

3. Start development mode (watch + reload):

   ```bash
   npm run dev
   ```

## Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Run in watch mode with `tsx`      |
| `npm run build`        | Compile TypeScript to `dist/`     |
| `npm start`            | Run compiled output from `dist/`  |
| `npm run typecheck`    | Type-check without emitting files |
| `npm run lint`         | Lint source files                 |
| `npm run lint:fix`     | Lint and auto-fix issues          |
| `npm run format`       | Format files with Prettier        |
| `npm run format:check` | Check formatting without writing  |
| `npm run clean`        | Remove `dist/` directory          |
| `npm run seed`         | Seed sample users into MongoDB    |
| `npm test`             | Run Jest tests                    |

## Project Structure

```
backend/
├── src/              # Application source (TypeScript)
├── dist/             # Compiled JavaScript (generated)
├── .husky/           # Git hooks
├── eslint.config.js
├── prettier.config.js
├── tsconfig.json
└── package.json
```

## Git Hooks

Husky runs lint-staged on pre-commit to lint and format staged files automatically.

## Environment Variables

See `.env.example` for available configuration options.

## API Contract

See [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md) for the fixed REST API consumed by the frontend.
