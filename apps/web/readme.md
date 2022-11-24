# DevClad's Client

Note: `app/stream` is for anything related to communication.

I used GetStream for the chat (plan to replace it is on the roadmap as we grow; it's a bit expensive) but the name stuck and now `stream` refers to everything related to communication.

## Social Auth

DevClad is not using any 3rd party auth service. This is how the auth-flow written from scratch works.

### Login/Connect Github

Note: Github is not used for signing up new users on DevClad. It's only used for logging in and connecting to Github.

-   User clicks on the Github button.

    -   `loginGithub` from `github.service.ts` is called. It redirects the user to Github's OAuth page.
    -   User logs in to Github. Redirects back to `/auth/complete/github/login/` on client.
    -   A request to a serverless function is made.

        ```ts
        const { pathname } = useLocation();
        const code = queryParams.get('code');
        const tokenUrl = `/api${pathname}`;
        const serverlessReq = async () => {
        	await axios.post(tokenUrl, { code });
        };
        ```

    -   `login` or `connect` request made to DevClad server at `/oauth/github/login/` with the code from Github in the body passed by the serverless function.
    -   `connect`:
        -   Validates whether the token is valid. If it's valid, a GithubOAuth object is created and saved to the database.
        -   If the token is invalid, an error is thrown.
    -   `login`:
        -   Validates whether the associated `username` (associated to the token) exists in GithubOAuth table. If it doesn't, an error is thrown. If it does, a refresh and access token is returned.
    -   The access and refresh tokens are saved in cookies and the user is redirected to `/`.

**Note**: You might notice `@sendgrid/mail` being present in both `dependencies` and `devDependencies`. This is because `@sendgrid/mail` is used in the serverless function. Vercel Serverless function sort of fumbles the path of installed modules when testing locally, so it's added in both places.
