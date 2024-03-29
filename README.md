<a href="https://www.producthunt.com/posts/devclad?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-devclad" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373373&theme=light" alt="DevClad - Meet&#0032;other&#0032;developers&#0032;1&#0058;1&#0032;&#0045;&#0032;team&#0032;up&#0032;on&#0032;projects&#0032;&#0043;&#0032;hackathons | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
<div align="center">
    <img src="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/011da5ea-039b-4be5-8e63-4461fef0cb00/public" width=25%>
    <h1>⚡ DevClad ⚡</h1>
   <i><b>Network, Build, and Ship rapidly ⚡</b></i>
    <p>A social workspace platform for developers to dive in a new realm.</p>
    <h3>
    <a href="#">🎥 Watch Demo (soon)</a>
    </h3>
    <h3>
    <a href="https://devclad.com/">🔮 Join or Login</a>
    </h3>

![Discord](https://img.shields.io/discord/812804160700284958?color=5865F2&label=Discord&logo=Discord&logoColor=ffffff&style=for-the-badge)
![Website](https://img.shields.io/website?down_color=bloodred&down_message=Systems%20Down&label=DevClad.com&style=for-the-badge&up_color=honeydew&up_message=Running&url=https%3A%2F%2Fdevclad.com)

</div>

## Features

## Roadmap

-   [X] Release v1 beta.

### Apps

-   [app/landing](https://github.com/DevClad-Inc/devclad-client/tree/main/apps/landing)
-   [app/web](https://github.com/DevClad-Inc/devclad-client/tree/main/apps/web)

---

## Contributing

## Styling

-   Tabs not spaces. Tabs are 4 spaces.
    -   (Exception: server code which uses Python with `black` formatting)
-   Use `prettier` for formatting.
-   Using [Airbnb Style Guide](https://github.com/airbnb/javascript) for ESLint with some modifications.

-   In the process of migrating to Romev10. Use `bun [command]` to run the linter/formatter. Prior to that, run `bun install` to install the dependencies. Why? `bun` is much faster even for a single commands like these.

## Absolute Imports

_Usage_: Use `@` for absolute imports.
_Exception_: Code within shared packages.

### Nixpack

Nixpack is used to deploy the server.
_Why are there 2 of those files?_ The one at the root of the repo is used for deployment. The one in `apps/server` is used for local builds. They are almost identical.

<div>
<h2>Sponsors</h2>
<a href="https://flightcontrol.dev">
<img src="https://user-images.githubusercontent.com/41021374/205244735-0746e0b3-6c26-4ca2-ad06-80ba2e5372e5.png" width=50%>
</a>
<br>
Shout out to <a href="https://flightcontrol.dev">FlightControl</a> for sponsoring <a href="https://devclad.com">DevClad's</a> API deployments to AWS Fargate on the Team Plan for free.
</div>
