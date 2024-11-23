---
title: Tables
layout: learn
---

## Startup

The `startup.ts` file is where you customize your application's startup behavior. Everything in this file is executed before the server starts, giving you control over the initialization process.

### Use cases

Here are typical tasks you might handle in the startup.ts file:

- Establish database connections.
- Seed the database with initial or default data.
- Validate environment variables.
- Perform other initialization tasks like setting up third-party services.

  - Monitoring or telemetry services (e.g., Sentry, Datadog).
  - Project-specific setup like loading configurations from files or APIs

- Register global event listeners or middlewares.

By default, the `startup.ts` file handles environment variable validation and database connection initialization.

### Example

Below is a realistic example of how a startup.ts file might look:

```ts
import { initialize } from '@extensions/sqlite';
import { validate } from '@workspace/validation';
import z from 'zod';

const env = z.object({
  ...(await import('@extensions/sqlite')).env,
  CONNECTION_STRING: z.string().url(),
  NODE_ENV: z.enum(['development', 'production']),
});

await validate(env, process.env);

await initialize()
  .then(() => {
    console.log('Database initialized');
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

- [Validates required environment](./environment-variables.md) variables and provides detailed error messages if anything is missing or invalid.

- Establishes a connection to your database, readying it for queries.

- If something critical like environment variables or database connections fails, the process exits immediately, saving you time debugging downstream issues and This ensures predictable behavior.
