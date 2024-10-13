---
title: Workflows
layout: learn
---

## Workflow

A workflow is a piece of code that is executed in response to a trigger which can be an http request, a message from a queue, a scheduler, github event, etc.

Speaking in terms of generated code, a workflow is the controller endpoint (http trigger) that is responsible for handling the request and executing the logic.

You can define a workflow by using the `workflow` function. A workflow is composed of the following elements:

- `tag` is used to namespace group of workflows.
- `trigger` is how you want your client to call this endpoint.
- `execute` is the function that will be executed when the workflow is triggered.

```ts
import { saveEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

workflow('AddOrderWorkflow', {
  tag: 'orders',
  trigger: trigger.http({
    method: 'post',
    path: '/',
  }),
  execute: async ({ trigger }) => {
    await saveEntity(tables.orders, {
      name: trigger.body.name,
    });
  },
});
```

This workflow is triggered by an http post request to the root path `/{featureName}/orders` and using http method `post`. once triggered, it will insert a record in the `orders` table with the name from the request body.

For instance it can be executed by sending a post request to the `/{featureName}/orders` path with a body like this:

```json
{
  "name": "order name"
}
```

### What is a trigger?

A trigger is an event that starts a workflow. in case of http, you can use 'post', 'get', 'put', 'delete', 'patch' methods.

```ts
trigger.http({
  method: 'post',
  path: '/',
});
```

You can also customise the path of the trigger to use rpc style for non standard methods with 'post' method. for example:

```ts
trigger.http({
  method: 'post',
  path: '/:param',
});
```

There are other triggers like `trigger.github`, `trigger.cron`, ... etc.

### What is the execute function?

The execute function is the function that is executed when the workflow is triggered. It takes a single argument, the trigger data that raised the workflow.

For example, you can update a record in a database, send an email, issuing a token, etc.

```ts
import { updateEntity } from '@extensions/postgresql';

const qb = createQueryBuilder(tables.orders, 'orders').where('id = :id', {
  id: trigger.path.id,
});
await updateEntity(qb, {
  name: trigger.body.name,
});
```

Each extension have its own set of functions, you can find set of exported function in its documentation. for more information about workflow execution, you can check the [Workflow Execution](/docs/execute) sections.

### What is a tag?

A tag is a way to group workflows in the code and in API documentation (aka swagger).

```ts
workflow('AddOrder',{
  tag: 'orders',
  trigger: trigger.http({
    method: 'post',
    path: '/',
  }),
  ...
});

workflow('UpdateOrder',{
  tag: 'orders',
  trigger: trigger.http({
    method: 'put',
    path: '/:id',
  }),
  ...
});

workflow('DeleteOrder',{
  tag: 'orders',
  trigger: trigger.http({
    method: 'delete',
    path: '/:id',
  }),
  ...
});
```

This setup will group the workflows under the `orders` tag in the API hence you'll have the following endpoints:

- POST /orders
- PUT /orders/:id
- DELETE /orders/:id
