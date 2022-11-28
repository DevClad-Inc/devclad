# DevClad Server

## Database and Async

-   PostgresQL (in prod only)
-   Django-Q + Redis for scheduling async tasks.
-   ~~Channel layer for websocket communication.~~
    - Using a self-hosted instance of PeerJS (located in `apps/peer`) for video calling.
    - Using Stream-Chat for chat (for now; will migrate to self-hosted Rocket.chat instance)

## Code Formatting

Using Black to format the code. Spaces not tabs.

## Testing

Feel free to add tests.
We do not do unit tests. Integration testing is an open issue so you could start with that.

### Gitpod

1. `pyenv install 3.10.6`
2. `pyenv shell 3.10.6`
3. `poetry env use python3.10`
4. `poetry shell`
5. `poetry install`
6. `python manage.py migrate`
7. `python manage.py runserver`

If something is broken about this Gitpod setup, fix it and make a PR.

### Run locally

You have 3 options to run the server locally (ones that the repo is tailored for);

1. Poetry+Pyenv (I like this the most)
  - setup similar to gitpod setup mentioned above.
2. Nixpacks + Docker (Fastest)
  0. Install using `brew install railwayapp/tap/nixpacks`.
  1. `cd apps/server`
  2. `nixpacks build ./ --name devclad`
  3. `docker run -it -p 127.0.0.1:8000:8000/tcp devclad`; go to port `8000` on `localhost`.
3. Dockerfile + Docker compose

For all these options, make sure your .env file is updated.
