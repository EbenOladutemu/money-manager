# my-money-manager

## Requirements
- Node 18+ recommended.
- Yarn Classic (v1); the repo is pinned via `packageManager: "yarn@1.22.22"`.
  You can run `corepack enable` to ensure the correct Yarn version is available.

## Install
```
yarn install
```

## Develop
```
yarn dev
```
Serves on http://localhost:8082 using Vite.

## Build
```
yarn build
```

## Preview production build locally
```
yarn preview
```

## Tests
```
yarn test:unit   # Jest
yarn test:e2e    # Cypress
```

## Lint and type-check
```
yarn lint
yarn type-check
```

## Notes
- Vite entrypoint: `src/main.ts`; static assets live in `public/`.
- The project has been migrated from npm/Vue CLI to Yarn + Vite.
