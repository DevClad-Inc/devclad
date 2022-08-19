# DevClad Client

Built using [React](https://reactjs.org/) + [Vite](https://vitejs.dev).

**Developer Docs**:

- [DevClad's Knowledgebase](https://stackoverflow.com/c/devclad/questions)
- Design Guidelines and other stuff - Notion

## Run in Development

>Install `yarn`: `npm install --global yarn`

1. Install packages - `yarn install`
2. Run dev server - `yarn run dev` (default port is `5173`)

`npm` works fine too. `yarn` is recommended.

>Run `pre-commit run -a` when running `pre-commit` hooks for the first time.

## Run in Production

- `yarn build` - builds the app for production in the `dist` directory.

We are going to deploy this on Cloudflare Pages for super-fast distribution.
Read more about it [here](https://blog.cloudflare.com/cloudflare-pages-is-lightning-fast/).

Our SPA will consume APIs built using Django REST Framework deployed on AWS.

- [DevClad-Server Repo](https://github.com/DevClad-Inc/devclad-server)

>`yarn preview` - preview the app on port `5173`.

---

## State Management

- [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) + [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer)

Read more about it [here](https://beta.reactjs.org/learn/scaling-up-with-reducer-and-context).

If we truly scale, we can use Redux.
But, for now, we'll use these hooks to build our own solution.

## Consuming APIs

- `react-query` - [React Query](https://reactquery.com/)
- `axios` - [Axios](https://axios-http.com/docs/intro)

## Styling

Using [Airbnb Style Guide](https://github.com/airbnb/javascript) for ESLint.

## TypeScript?

We will migrate our codebase to TypeScript possibly after we've launched and have a stable release.
