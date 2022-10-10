# DevClad - Social Workspace for Developers

Uses [Turborepo](https://turborepo.com).

## Run in Development

> Install `yarn`: `npm install --global yarn`

1. Install packages - `yarn install`
2. Run dev server - `yarn run dev` (default port is `5173`)

> Run `pre-commit run -a` when running `pre-commit` hooks for the first time.

### Apps

- [app/landing](https://github.com/DevClad-Inc/devclad-client/tree/main/apps/landing)
- [app/web](https://github.com/DevClad-Inc/devclad-client/tree/main/apps/web)

---

## UI

- Using TailwindCSS for styling.

## State Management

- [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) + [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [React Query](https://react-query.tanstack.com/) to keep client state and server states in sync.
- Zustand/Jotai if needed later.

## Styling

Using [Airbnb Style Guide](https://github.com/airbnb/javascript) for ESLint with some modifications.

## Absolute Imports

_Usage_: Use `@` for absolute imports.
_Exception_: Code within shared packages.
