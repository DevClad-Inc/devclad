# DevClad Server

[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/DevClad-Inc/devclad-server/main.svg?badge_token=f-dm_fPcS1OkNkewX2lOtQ)](https://results.pre-commit.ci/latest/github/DevClad-Inc/devclad-server/main?badge_token=f-dm_fPcS1OkNkewX2lOtQ)

Built using [Django](https://www.djangoproject.com/).

**Developer Docs**:

- [DevClad's Knowledgebase](https://stackoverflow.com/c/devclad/questions)
- Design Guidelines and other stuff - Notion

## Development Setup

**Recommendation**: Use SQLite in development. To reproduce Postgres related errors, use Docker with Postgres; temporarily change the DB in settings to use Postgres.

- **Option 1: Poetry**:

  To use multiple versions of Python, you can use `pyenv`:
  3.10.6 is an example for our use-case.

  - Install `pyenv` using `brew`.
  - `pyenv install 3.10.6`.
  - Launch shell - `pyenv shell 3.10.6`.

    Install Poetry: [Read more here](https://python-poetry.org/docs/)

    1. `poetry config virtualenvs.in-project true`
    2. `poetry self update` to update to the latest version of Poetry.
    3. If you used, `pyenv shell`, you can now run `poetry env use python3.10.6`.
    4. `poetry install` to install all dependencies.
    5. `poetry export --without-hashes --format=requirements.txt > requirements.txt` to export the requirements without hashes.

- **Option 2: Docker**:

  - Docker is cool, however, I'd recommend not launching a resource-heavy container every time you want to run a development server.
    1. Install Docker: [Read more here](https://www.docker.com/community-edition)
    2. `docker-compose build` to build the Docker image.
    3. `docker-compose up` to start the server.

- **Make sure to use the pre-commit hook**
  1. Installation - [Read more here](https://pre-commit.com)
  2. `pre-commit install` to install the pre-commit hooks.
  3. `pre-commit run -a` to run the pre-commit hooks.

---

## Database and Async

- PostgresQL (in prod only)
- Redis for caching and async tasks.
- Channel layer for websocket communication.
- Celery for scheduling async tasks.

## Code Formatting

Using Black to format the code.

## Testing

Use `pytest` to run the tests.

More specifically, use the following commands:

- `docker-compose exec server pytest`, or
- `pytest` within `poetry shell`.

Do not waste time on testing trivial stuff.

## Deployment - Production

We are going to use the Docker image to deploy to AWS ECS at [api.devclad.com](https://api.devclad.com). This will provide the APIs for the DevClad client running on Cloudflare at [app.devclad.com](https://app.devclad.com).
