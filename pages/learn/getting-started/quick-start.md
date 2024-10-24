---
title: Quick Start
layout: learn
---

## Create a new project

January CLI helps you to scaffold a new project configured with all bits and pieces you need to start building your API.

```bash
npm create january@latest project-winter
```

Once done, you should see a new directory called `project-winter`

```bash
cd project-winter
```

Open it in your favorite code editor and run the following command:

```bash
npm run dev
```

## The development environment

By default, the project is configured to use SQLite as the database, Hono as the framework, and Serverize as the cloud provider.

You don't need to install anything else to get started. Just run the server and you are good to go.

You can change this configuration by editing the `tools/january.config.js` file.
