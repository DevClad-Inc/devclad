# DevClad Server

## Database and Async

-   PostgresQL (in prod only)
-   Django-Q + Redis for scheduling async tasks.
-   Channel layer for websocket communication.

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
