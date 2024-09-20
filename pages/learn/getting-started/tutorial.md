---
title: Tutorial
layout: learn
---

This tutorial demonstrates how to create a Fruits taxification API using January;explaining how to build RESTful APIs, integrate with PostgreSQL, and deploy to Fly.io.

## Steps

- [Create a new project](#create-a-new-project)
- [Add Fruits Feature](#add-fruits-feature)
- [Add Tables](#add-tables)
- [Add Workflows](#add-workflows)
- [Swagger](#swagger)
- [Deploy to Fly.io](#deploy-to-flyio)

## Create a new project

Please refer to the [Quick Start](./quick-start) guide for more information.

## Add Fruits Feature

Features are what make up a project. They are used to group related functionalities, such as tables, workflows, and policies.

```ts
feature('Fruits', {
  workflows: [workflow(...)],
  tables: {
    fruits: table(...),
  },
});
```

## Add Tables

Tables are used to define the structure of the database, such as tables, columns, and relationships. Depending on the database extension ORM, the table definition may vary slightly.

To define a table, you can use the `table` function which accepts map of fields and their configurations.

Refer to the [Fields](../concepts/tables#what-is-a-field) section for more information.

For the purpose of this tutorial, we will define two tables: **fruits** and **family** with many-to-one relationship.

1. `fruits`: Stores information about individual fruits
2. `family`: Categorizes fruits into families

```ts
feature('Fruits', {
  fruits: table({
    fields: {
      name: field.shortText(),
      price: field.price()
      family: field.relation({
        references: useTable('family'),
        relationship: 'many-to-one',
      }),
    },
  }),
  family: table({
    fields: {
      name: field.enum(['berries', 'citrus', 'other']),
    },
  }),
});
```

## Add Workflows

A workflow is a piece of code that is executed in response to a trigger which can be an http request, a message from a queue, a scheduler, github event, etc.

For this tutorial you'll use the `trigger.http` that integrates with the HTTP server (think express.js, hono.dev, etc.).

Let's create CRUD operations for our Fruits API:

1. List Fruits
2. Get Fruit
3. Create Fruit
4. Update Fruit
5. Delete Fruit

**List Fruits workflow**

```ts
import {
  createQueryBuilder,
  deferredJoinPagination,
  execute,
} from '@extensions/postgresql';

workflow('ListFruitsWorkflow', {
  tag: 'fruits',
  trigger: trigger.http({
    method: 'get',
    path: '/',
  }),
  execute: async trigger => {
    const qb = createQueryBuilder(tables.fruits, 'fruits');
    const paginationMetadata = deferredJoinPagination(qb, {
      pageSize: trigger.query.pageSize,
      pageNo: trigger.query.pageNo,
      count: await qb.getCount(),
    });
    const records = await execute(qb);
    const output = {
      meta: paginationMetadata(records),
      records: records,
    };
    return output;
  },
});
```

The `execute` function is used to execute the query and return the result once the workflow is triggered by an HTTP request.

You can try it out by running the following command:

```bash
curl -X GET \
  -H "Content-Type: application/json" \
  http://localhost:3000/fruits
```

**Save fruit workflow**

```ts
import { saveEntity } from '@extensions/postgresql';

workflow('SaveFruitWorkflow', {
  tag: 'fruits',
  trigger: trigger.http({
    method: 'post',
    path: '/',
  }),
  execute: async trigger => {
    await saveEntity(tables.fruits, {
      name: trigger.body.name,
      price: trigger.body.price,
    });
  },
});
```

---

The `saveEntity` function is used to save an entity to the database.

## Swagger

Each feature will have its own swagger page that you can access at `/{featureName}/swagger` to interact with the API.
January integrates with [Scalar](https://scalar.com/) to display the swagger page.

## Deploy to Fly.io

To deploy your application to Fly.io, you need to create an account on the [Fly.io website](https://fly.io/). After creating an account, you can create a new app on the [Fly.io dashboard](https://fly.io/apps).

Or you can install and manage you app via the CLI by following the instructions on the [Fly.io website](https://fly.io/docs/getting-started/installing-fly/)

---

To create an app through the cli:

- First, login to your Fly.io account:

```bash
fly auth login
```

- Then, create a new app:

```bash
fly apps create <app-name>
# fly apps create awesome-app
```
