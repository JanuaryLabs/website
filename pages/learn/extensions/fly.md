---
title: Fly.io Extension
layout: learn
---

## Fly.io Extension

Fly.io extension is a deployment extension that you can use to deploy your application to Fly.io machine.

### Configuration

In order to deploy your application to Fly.io, you need to create an account on the [Fly.io website](https://fly.io/). After creating an account, you can create a new application on the [Fly.io dashboard](https://fly.io/apps).

Or you can install and manage you app via the CLI by following the instructions on the [Fly.io website](https://fly.io/docs/getting-started/installing-fly/)

#### Settings

From either fly cli or the fly.io dashboard, you need to obtain the API token and set the secrets on the Fly.io machine.

- First, login to your Fly.io account:

```bash
fly auth login
```

- Then, create a new app:

```bash
fly apps create <app-name>
# fly apps create awesome-app
```

#### Environment Variables

You can set the Fly.io application secrets(environment variables) on the following URL:

```txt
https://fly.io/apps/<app-name>/secrets

where <app-name> is the name of the Fly.io application.
example: https://fly.io/apps/awesome-app/secrets
```

Or via the Fly.io CLI:

```bash
flyctl secrets set CONNECTION_STRING="postgres://user:password@host:port/dbname"
```

#### Build Variables

The following variables are required to deploy your application to Fly.io:

```txt
FLY_APP_NAME=The name of the Fly.io application.

FLY_API_TOKEN=The API token to authenticate with Fly.io.
```

**FLY_APP_NAME**: The fly.io app name.

**FLY_API_TOKEN**: You can obtain the API token from the Fly.io dashboard or via the Fly.io CLI.

Using CLI

```bash
fly tokens create deploy -a <app-name>
```

Using Dashboard

```txt
https://fly.io/dashboard/<account-name>/tokens
```

### Deploy

Make sure you have the required environment variables set on the Fly.io machine. Then, you can deploy your application to Fly.io by committing the changes to the repository.

Once environment variables are set and changes are committed, the project will be reachable at the following URL:

```bash
https://<app-name>.fly.dev/

# example: https://awesome-app.fly.dev/
```
