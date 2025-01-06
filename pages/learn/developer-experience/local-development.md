---
title: Local Development
layout: learn
---

## Local Development

January prioritizes developer experience by providing a streamlined local development setup that simplifies the process of testing and debugging API applications.

### Docker Compose Setup

The `node tools/compose.js` command generates a docker-compose configuration file (`compose.dev.yml`) at the project root that sets up a local development environment with the following services:

- `database`: A Postgres database instance is created using the `postgres:16` image. The `POSTGRES_PASSWORD`, `POSTGRES_USER`, and `POSTGRES_DB` environment variables are set to some default values to enable connection to the database. You can change them to more secure credentials if needed but you might need to update them in other locations like the `CONNECTION_STRING` in the `.env.compose` file.
- `pgadmin`: A PgAdmin instance is started for easy database management and monitoring. Default admin credentials are set up for you, but you can change them easily in the `compose.dev.yml` file. When setting up a database connection, you must use the database service name, `database` by default, as the URL.
- `server`: A Node.js server container is built from the local project's Dockerfile, using the `node:lts` image. The server is configured to watch changes in the `server.js` file and rebuild the application as needed. However, the project must be built using `npm run build` beforehand and the latest `output` folder is generated as a result.

### Using the Compose Setup

To use the generated docker-compose configuration:

1. Run `node tools/compose.js` in your terminal to generate the `compose.dev.yml` and `.env.compose` files.
2. Make sure you are running the latest build by running `npm run build`.
3. Start the development environment using `docker-compose -f compose.dev.yml up --build --watch --remove-orphans`.
4. Access the server at <http://localhost:3000> and use PgAdmin at <http://localhost:8080>.

This setup streamlines local development by providing a pre-configured environment for testing and debugging API applications, reducing the overhead of setting up individual services.
