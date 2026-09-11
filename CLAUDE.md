# Mina — Backend

Instructions for Claude working in this repo. Follow them on every file you create.

## 0. Write the least code possible

The highest priority rule, above every convention below. Reuse before you write.

- Before adding anything, search for what already exists and use it. A new helper that duplicates an existing one is a bug.
- Prefer the platform: native Node and Express APIs. Reach for a library only when the hand-rolled version would be materially worse.
- No abstraction until there is a second caller. No wrapper that only forwards arguments. No barrel file for one export. No `try/catch` that only rethrows — let the global error handler do its job.
- No defensive branches for states that cannot happen, no options nobody passes, no premature generalisation.
- Delete rather than comment out. Comment only what the code cannot say itself — the *why*, never the *what*.
- The smallest diff that fully solves the problem wins. If a change feels large, question the approach before writing it.

## 1. Project state

Greenfield. Built from scratch together with the user — assume nothing exists until you have read it.

- **This repo** (`Mina_Back_Dev`) — Express 5 + TypeScript API, ESM.
- **`Mina_Front_Dev`** (sibling folder) — React + Vite SPA, the only client.
- **Supabase** — database, auth and storage. This process holds the `service_role` key, so it may do anything the frontend is not allowed to.

Anonymous, public reads (such as `onboard_content`) go **straight from the frontend to Supabase** and never touch this API. Only add an endpoint here when the work needs a secret, elevated privileges, or server-side logic.

## 2. Stack

| Concern | Library |
|---|---|
| Runtime | Node + TypeScript (ESM) |
| HTTP | `express` |
| CORS | `cors` |
| Dev runner | `tsx` |
| Validation | `zod` |

**Do not add a dependency outside this table without asking the user first.**

## 3. Folder map

```
src/
├── config/        env.ts — every environment variable, validated
├── controllers/   Request handlers: parse, delegate, respond
├── middlewares/   auth, validation, error handling
├── routes/        Router definitions mapping paths to controllers
├── services/      Business logic and all data access
├── types/         Models — interfaces, types, enums
├── lib/           Pure helpers and app-wide constants
├── app.ts         Express app assembly
└── server.ts      Port binding only
```

## 4. Folder rules

### `config/`

- `env.ts` is the **only** file allowed to read `process.env`. Parse it through a `zod` schema and export the frozen result, so a missing variable crashes at boot rather than at the first request.

### `controllers/`

- **Put here** — one exported handler per endpoint. Read the request, call a service, send the response.
- **Never here** — business logic, SQL, or Supabase calls. A controller that does real work belongs in a service.
- **Naming** — `xxx.controller.ts`.

### `middlewares/`

- **Put here** — cross-cutting request concerns: auth, request validation, the global error handler.
- **Naming** — `xxx.middleware.ts`.

### `routes/`

- **Put here** — one `express.Router()` per domain, mapping paths to controllers. Routers are mounted in `app.ts`.
- **Never here** — handler bodies. Point at a controller.
- **Naming** — `xxx.routes.ts` exporting `xxxRouter`.

### `services/`

- **Put here** — business logic and **all** data access: the Supabase client and one module per domain.
- **Never here** — `req` or `res`. A service takes and returns plain data so it stays testable.
- **Naming** — `xxx.service.ts`.

### `types/`

- **Put here** — anything with a shape: domain models, request/response bodies. Keep shared models identical to the frontend's `types/`.
- **Naming** — `PascalCase`, **no `I` prefix**. Files are `xxx.types.ts`.

### `lib/`

- **Put here** — pure functions with no I/O and no Express import, plus static constants shared across services (magic numbers, fixed durations, static lookups). Named to match the frontend's `lib/` for the same kind of content.
- **Naming** — `camelCase.ts`, grouped by subject (`date.ts`, `constants.ts`).

## 5. Request flow

```
route → middleware → controller → service → Supabase
```

Never skip a layer, and never reverse it: a service must not import a controller.

## 6. Conventions

- **ESM imports need the `.js` extension** on relative paths (`./app.js`), even though the source is `.ts`. That is what `module: nodenext` requires at runtime.
- **No path alias.** `tsconfig` paths are invisible to Node at runtime, so relative imports only.
- Throw errors from services; let the global error handler in `app.ts` format the response. Do not `res.status(500)` in a catch block in every controller.
- `app.ts` assembles and exports the app; `server.ts` only binds the port. Keep them separate so tests can import the app without opening a socket.
- Register the global error handler **last** in `app.ts`.

## 7. Environment variables

Read only in `config/env.ts`, via a `zod` schema. See `.env.example` for the current set.

`.env` is gitignored; `.env.example` is committed with every key present and all values blank. Adding a variable means three edits: `.env`, `.env.example`, and the schema.

Real secrets belong here, never in the frontend bundle — `SUPABASE_SERVICE_ROLE_KEY` above all.

## 8. Adding an endpoint

Work bottom-up so each layer compiles against the one below:

1. `types/xxx.types.ts` — request, response and model shapes.
2. `services/xxx.service.ts` — the logic and data access.
3. `controllers/xxx.controller.ts` — parse, delegate, respond.
4. `routes/xxx.routes.ts` — map the path to the controller.
5. Mount the router in `app.ts`.

Before finishing, check the change against §5. If any import points backwards or skips a layer, fix the placement.
