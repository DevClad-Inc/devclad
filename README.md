# DevClad - Social Workspace for Developers

![devclad](https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/677a1e0a-bd95-4e85-7aa3-86287a865f00/public)

Uses [Turborepo](https://turborepo.com).

## Run in Development

> Install `yarn`: `npm install --global yarn`

1. Install packages - `yarn install`
2. Run dev server - `yarn run dev` (default port is `5173`)

> Run `pre-commit run -a` when running `pre-commit` hooks for the first time.

For instructions on how to run the server, see [server/README.md](apps/server/readme.md).

### Apps

- [app/landing](https://github.com/DevClad-Inc/devclad-client/tree/main/apps/landing)
- [app/web](https://github.com/DevClad-Inc/devclad-client/tree/main/apps/web)

---

## Contributing

## Styling

- Tabs not spaces. Tabs are 2 spaces.
- Use `prettier` for formatting.
- Using [Airbnb Style Guide](https://github.com/airbnb/javascript) for ESLint with some modifications.

## Absolute Imports

_Usage_: Use `@` for absolute imports.
_Exception_: Code within shared packages.
