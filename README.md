# DevClad Client

[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/DevClad-Inc/devclad-client/main.svg?badge_token=ptwMSAxYRcKAB0XY41u0DA)](https://results.pre-commit.ci/latest/github/DevClad-Inc/devclad-client/main?badge_token=ptwMSAxYRcKAB0XY41u0DA)

Built using [React](https://reactjs.org/) + [Vite](https://vitejs.dev).

**Developer Docs**:

- [DevClad's Knowledgebase](https://stackoverflow.com/c/devclad/questions)
- Design Guidelines and other stuff - Notion

## Run in Development

>Install `yarn`: `npm install --global yarn`

1. Install packages - `yarn install`
2. Run dev server - `yarn run dev` (default port is `5173`)

`npm` works fine too. `yarn` is STRONGLY recommended.

>Run `pre-commit run -a` when running `pre-commit` hooks for the first time.

## Run in Production

- `yarn build` - builds the app for production in the `dist` directory.

We are going to deploy this on Cloudflare Pages for super-fast distribution.
Read more about it [here](https://blog.cloudflare.com/cloudflare-pages-is-lightning-fast/).

Our SPA will consume APIs built using Django REST Framework deployed on AWS.

- [DevClad-Server Repo](https://github.com/DevClad-Inc/devclad-server)

>`yarn preview` - preview the app on port `5173`.

---

## UI

- **Primarily using**: [Tailwind UI](https://tailwindui.com/) - Application UI. (I have a personal license for this, I'll be adding everything we need from it in the repo anyway.)
  - Use `clsx` for classnames. Helpful for conditional styling like dark mode and stuff.
  - TailwindUI also uses Headless UI for interactivity+accessibility in its components.
    - [Headless UI](https://headlessui.dev)

- We could use [Radix](https://radix-ui.dev) with Tailwind [like this](https://tailwindcss-radix.vercel.app/) in certain places since it's a component-basis installation without bloat.

## State Management

- [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) + [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [React Query](https://react-query.tanstack.com/) to keep client state and server states in sync.
- Something like Little State Machine with React Hook Form for multi-step forms (maybe).
- Zustand if needed later.

Read more about it [here](https://beta.reactjs.org/learn/scaling-up-with-reducer-and-context).

If we truly scale, we can use Redux.
But, for now, we'll use these hooks to build our own solution.

## Consuming APIs

- `axios` - [Axios](https://axios-http.com/docs/intro)

## Styling

Using [Airbnb Style Guide](https://github.com/airbnb/javascript) for ESLint.

## Absolute Imports

*Usage*: Use `@` for absolute imports.
*Exception*: `./` imports in `main.tsx` and `App.tsx`.

## TypeScript?

We will migrate our codebase to TypeScript possibly after we've launched and have a stable release.
