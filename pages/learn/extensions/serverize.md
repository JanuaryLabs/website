---
title: Serverize Extension
layout: learn
---

## Serverize Extension

Serverize extension is a deployment extension that you can use to deploy your application to Serverize.

To get started, you've to create an account if you don't have one:

```bash
npx serverize auth signin # or signup
```

- Then, create a new project:

```bash
npx serverize projects create <project-name>

# npx serverize projects create my-awesome-project
```

Note: In case you just signed up, an account will be created automatically.

#### Environment Variables

You can set the Serverize application secrets (environment variables) using the secrets command

```bash
npx serverize secrets set -p <project-name> CONNECTION_STRING="postgres://user:password@host:port/dbname"
```

Or you can point to a file that contains the secrets:

```bash
npx serverize secrets set-file -p <project-name> <env-file-name>

# npx serverize secrets set-file -p my-awesome-project .env
```

Make sure you have the required environment variables set before deploying otherwise the server will fail.

#### CI/CD

The required workflow/pipeline are generated for you. You can find them in the `.github/workflows` directory.

The following variables are required to deploy your application to Serverize:

- `SERVERIZE_API_TOKEN`: The API token to authenticate with Serverize.

```bash
npx serverize tokens create deploy -a <project-name>
```

Push the changes to your repository to trigger the workflow/pipeline.

### Local Deployment

You can deploy right from your terminal:

```bash
npx serverize deploy -p <project-name>
```
