# Contributing to DevClad

## Run in Development

### Client

> Install `yarn`: `npm install --global yarn`

1. Install packages - `yarn install`
2. Run dev server - `yarn run dev` (default port is `5173`)

> Run `pre-commit run -a` when running `pre-commit` hooks for the first time.

For instructions on how to run the server, see [server/README.md](apps/server/readme.md).

### Server

-   **Option 1: Poetry**:

    To use multiple versions of Python, you can use `pyenv`:
    3.10.6 is an example for our use-case.

    -   Install `pyenv` using `brew`.
    -   `pyenv install 3.10.6`.
    -   Launch shell - `pyenv shell 3.10.6`.

        Install Poetry: [Read more here](https://python-poetry.org/docs/)

        1. `poetry config virtualenvs.in-project true`
        2. `poetry self update` to update to the latest version of Poetry.
        3. If you used, `pyenv shell`, you can now run `poetry env use python3.10.6`.
        4. `poetry install` to install all dependencies.
        5. `poetry export --without-hashes --format=requirements.txt > requirements.txt` to export the requirements without hashes.

-   **Option 2: Docker**:

    -   Docker is cool, however, I'd recommend not launching a resource-heavy container every time you want to run a development server.
        1. Install Docker: [Read more here](https://www.docker.com/community-edition)
        2. `docker-compose build` to build the Docker image.
        3. `docker-compose up` to start the server.

-   **Make sure to use the pre-commit hook**
    1. Installation - [Read more here](https://pre-commit.com)
    2. `pre-commit install` to install the pre-commit hooks.
    3. `pre-commit run -a` to run the pre-commit hooks.
