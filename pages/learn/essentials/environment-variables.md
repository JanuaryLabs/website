---
title: Tables
layout: learn
---

## Environment variables

In Node.js, environment variables are accessible through the process.env object but they are not type-safe. This means that you can't be sure that the value of a variable is a string, number, or boolean.

January provides a function to validate environment variables and make them type-safe. This functionality is already included in the `startup.ts` file by default.

```ts
import { initialize } from '@extensions/sqlite';
import { validate } from '@workspace/validation';
import z from 'zod';

const env = z.object({
  ...(await import('@extensions/sqlite')).env,
  NODE_ENV: z.enum(['development', 'production']),
});

// Validate the environment variables
const errors = validate(env, process.env);
if (errors) {
  console.error(
    'Environment Variable Validation Error:',
    JSON.stringify(errors, null, 2)
  );
  console.error(
    'Please check that all required environment variables are correctly set.'
  );
  process.exit(1);
}

// Parse and assign validated environment variables to process.env
process.env = Object.assign({}, process.env, env.parse(process.env));

// Extend the ProcessEnv interface to enable type-safe access
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> {}
  }
}
```

Accessing the `NODE_ENV` environment variable is now type-safe and you can use it to conditionally execute code based on the environment.

```ts
// This is known by TypeScript union type and you editor can provide intellisense for the possible values
if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
}
```

### Updating Environment Variables Schema

The environment variables schema is defined using the [Zod](https://github.com/colinhacks/zod) library and can be extended to include additional variables.

```ts
const env = z.object({
  OPENAI_API_KEY: z.string(),
});
```

### Presets

Each January extension comes with a preset that specifies the required environment variables. For example, the sqlite extension requires a `CONNECTION_STRING` variable. You can import its preset and extend the env object accordingly.

If you're using multiple extensions, such as `firebase-auth`, you can easily combine them. Here's an example:

```ts
const env = z.object({
  ...(await import('@extensions/sqlite')).env,
  ...(await import('@extensions/firebase-auth')).env,
  NODE_ENV: z.enum(['development', 'production']),
});
```

By doing so, you ensure all required environment variables for your extensions are validated and type-safe, streamlining the development process.

### Errors

This logic is place in the [`startup.ts`](./startup.md) file, so it's executed when the program starts, hence, it's important to check that all the environment variables are correctly set in your server.

As shown above, if the validation fails, the program will exit with an error message and object containing the errors.
