---
title: HTTP Trigger
layout: learn
---

## HTTP Trigger

The HTTP trigger is used to create workflows that respond to HTTP requests, process data, and return responses allowing you to build RESTful APIs and web services.

```ts
workflow('CreateTodo', {
  tag: 'tasks',
  trigger: trigger.http({
    method: 'post',
    path: '/',
  }),
  execute: async ({ trigger }) => {
    return {
      statusCode: 200,
      body: {
        message: 'Todo created successfully',
        id: crypto.randomUUID(),
      },
    };
  },
});
```

_This workflow will be triggered by a `POST` request to the path `/tasks`._

#### How it works

The HTTP trigger is implemented through a routing extension (e.g., Hono.dev, Express, Koa) included in every project. It translates the workflow into an HTTP endpoint following this pattern:

```bash
/{workflowTag}/{triggerPath}
```

Supported HTTP methods include GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS, though availability may vary based on the routing extension used.

### How to use it?

You can access the request body, query parameters, and headers using the trigger object and after ensuring the client data is valid using the `input` function, they can be used in the workflow.

```ts
workflow('UpdateTodo', {
  tag: 'tasks',
  trigger: trigger.http({
    method: 'patch',
    path: '/:id',
    input: trigger => ({
      id: {
        select: trigger.path.id,
        against: z.string().uuid(),
      },
      title: {
        select: trigger.body.title,
        against: z.string().trim().min(1),
      },
      completed: {
        select: trigger.body.completed,
        against: z.boolean(),
      },
    }),
  }),
  execute: async ({ input }) => {
    return {
      id: input.id,
      title: input.title,
      completed: input.completed,
    };
  },
});
```
