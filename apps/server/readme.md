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

- `pyenv install 3.10.6`
- `pyenv shell 3.10.6`
- `poetry env use python3.10`
- `poetry shell`
- `poetry install`
- `python manage.py migrate`
- `python manage.py runserver`
