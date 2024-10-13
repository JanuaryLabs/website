---
title: PostgreSQL Extension
layout: learn
---

## PostgreSQL Extension

PostgreSQL extension is a database extension that allows you to interact with a PostgreSQL database.

### Setup

#### Production

You can use providers such as [Fly.io](https://fly.io/), [Neon.tech](https://neon.tech/), [DigitalOcean](https://digitalocean.com/), etc. Or run your own database server.

From the application perspective it needs the following environment variables:

```txt
CONNECTION_STRING=The connection string to the PostgreSQL database.
```

#### Development

For development, you need to have a database server running locally which can be via either of the following methods:

##### Using pre-configured docker compose

The scaffolding process creates a `tools/compose.ts` file that is pre-configured to prepare the development environment for you. Just run it and you shall be set.

- Open another terminal window and run the following command:

```bash
npx tsx tools/compose.ts
```

- Run postgres container, start the server, and watch for changes

```bash
docker compose \
  -f "compose.dev.yml" \
  up \
  --build \
  --watch \
  --remove-orphans
```

_This command uses docker `--watch` mode to automatically restart the server when you make changes._

##### Using standalone postgres container

- Create postgres container

```bash
docker run \
  --name postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_USER=youruser \
  -e POSTGRES_DB=yourdatabase \
  -d \
  -p 5432:5432 \
  postgres:16
```

When you're done having the database server running, update the `.env` file:

```bash
CONNECTION_STRING=postgresql://youruser:yourpassword@localhost:5432/yourdatabase
```

### Functions

The following functions are available:

- **limitOffsetPagination**: Retrieve a list of records in a table with limit and offset pagination.
- **deferredJoinPagination**: Retrieve a list of records in a table with deferred joins pagination.
- **cursorPagination**: Retrieve a list of records in a table with cursor pagination.
- **saveEntity**: Insert a record in a table.
- **updateEntity**: Update a record in a table.
- **removeEntity**: Delete a record in a table.
- **upsertEntity**: Insert a record if it does not exist, or update it if it already exists, based on a unique constraint.
- **increment**: Increment a column in a record in a table.
- **decrement**: Decrement a column in a record in a table.
- **sql**: Execute a raw query.

#### List

Retrive a list of records in a table with ability to select a pagination strategy and limit the number of records returned.

Available pagination strategies:

- **limit_offset**: This strategy is used when you want to retrieve records in a paginated way using limit and offset.
- **deferred_joins**: Similar to limit_offset, but improves upon it by performing the projection on the records after pagination. [Read more](https://arc.net/l/quote/hxjxwjxa)
- **cursor**: This strategy is used when you want to retrieve records in a paginated way using a cursor.

**Retrieve 50 blogs with deferred joins pagination strategy**:

```ts
import {
  createQueryBuilder,
  deferredJoinPagination,
  execute,
} from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs');
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
```

**With cursor pagination strategy**:

```ts
import {
  createQueryBuilder,
  cursorPagination,
  execute,
} from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs');
const paginationMetadata = cursorPagination(qb, {
  pageSize: trigger.query.pageSize,
  cursor: trigger.query.cursor,
  count: await qb.getCount(),
});
const records = await execute(qb);
```

**With limit_offset pagination strategy**:

```ts
import {
  createQueryBuilder,
  execute,
  limitOffsetPagination,
} from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs');
const paginationMetadata = limitOffsetPagination(qb, {
  pageSize: trigger.query.pageSize,
  pageNo: trigger.query.pageNo,
  count: await qb.getCount(),
});
const records = await execute(qb);
```

#### Insert

Insert a record in a table.

**Insert a blog**:

```ts
import { saveEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

await saveEntity(tables.blogs, {
  title: trigger.body.title,
  content: trigger.body.content,
});
```

This function will insert a record in the `Blogs` table with the title and content from the request body.

#### Set

Set a column or more in a record in a table.

**Change the title of a blog**:

```ts
import { createQueryBuilder, updateEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('id = :id', {
  id: trigger.path.id,
});
await updateEntity(qb, {
  title: trigger.body.title,
});
```

#### Delete

Delete a record or many in a table given a query.

**Delete a blog**:

```ts
import { createQueryBuilder, removeEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('id = :id', {
  id: trigger.path.id,
});

await removeEntity(qb);
```

This function will delete one blog that has the id from the request path.

**Delete all blogs**:

```ts
import { createQueryBuilder, removeEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs');
await removeEntity(qb);
```

Be careful with this fuction as it will delete all records in the `Blogs` table.

#### Exists

Check if at least one record exists in a table given a query.

**Check if a blog exists**:

```ts
import { createQueryBuilder, exists } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('id = :id', {
  id: trigger.path.id,
});
const exists = await exists(qb);
```

**Check if a blog exists by title**:

```ts
import { createQueryBuilder } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('title = :title', {
  title: trigger.body.title,
});
const exists = await qb.getOne().then(Boolean);
```

In the above example, the function will check if a blog exists with the title from the request body. In case more than one blog exists with the same title, the function will return true.

#### Upsert

Insert a record if it does not exist, or update it if it already exists, based on a unique constraint.

**Upsert a blog**:

```ts
import { createQueryBuilder, upsertEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

await upsertEntity(
  tables.blogs,
  {
    id: trigger.body.id,
    title: trigger.body.title,
    content: trigger.body.content,
  },
  ['id'] // unique key
);
```

In the above example, the function will insert a blog if no blog exists with the id from the request body, or update it if it does.

**Upsert a blog by title**:

You can make use of the `conflictFields` property to specify the fields that should be used to check for conflicts.

Keep in mind that the `conflictFields` property should be an array of fields that are unique in the table. If the table have a compund unique key, you have to specify all the fields in the `conflictFields` property.

Given the following table with a unique key on the `title` field:

```ts
table('Blogs', {
  fields: {
    title: field({ config: 'short-text', validation: [unique()] }),
    content: field({ config: 'long-text' }),
    author: field({ config: 'short-text' }),
  },
});
```

```ts
import { createQueryBuilder, upsertEntity } from '@extensions/postgresql';

await upsertEntity(
  tables.blogs,
  {
    title: trigger.body.title,
    content: trigger.body.content,
  },
  ['title'] // unique key
);
```

NOTE: you cannot specify a field that is not unique in the `conflictFields` property and more than one unique key. so `[useField('id'), useField('title')]` will not work.

**Compound unique key**:

Given the following table with a compound unique key on the `post` and `user` fields:

```ts
table('Blogs', {
  constraints: [index(useField('title'), useField('author'))],
  fields: {
    title: field({ config: 'short-text' }),
    content: field({ config: 'long-text' }),
    author: field({ config: 'short-text' }),
  },
});
```

You can set the `conflictFields` property as follows:

```ts
import { createQueryBuilder, upsertEntity } from '@extensions/postgresql';

await upsertEntity(
  tables.blogs,
  {
    title: trigger.body.title,
    content: trigger.body.content,
  },
  ['title', 'author'] // unique key
);
```

Now, the function will update the blog if a blog exists with the same title and author from the request body, or insert it if it does not exist.

#### Search

Search for records in a table by specifying columns to search within.

**Search for blogs**:

```ts
import { createQueryBuilder, execute } from '@extensions/postgresql';

const qb = createQueryBuilder(tables.blogs, 'blogs').where(
  'title ILIKE :search OR content ILIKE :search',
  {
    search: `%${trigger.query.search}%`,
  }
);
const paginationMetadata = limitOffsetPagination(qb, {
  pageSize: trigger.query.pageSize,
  pageNo: trigger.query.pageNo,
  count: await qb.getCount(),
});
const records = await execute(qb);
```

#### Increment

Increment a column in a record in a table.

**Increment the views of a blog**:

```ts
import { createQueryBuilder, increment } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('id = :id', {
  id: trigger.path.id,
});

await increment(qb, 'views', 1);
```

#### Decrement

Decrement a column in a record in a table.

**Downvote a blog**:

```ts
import { createQueryBuilder, decrement } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('id = :id', {
  id: trigger.path.id,
});

await decrement(qb, 'votes', 1);
```

#### Raw Query

You can execute raw queries using the `sql` function.

**Execute a raw query**:

```ts
import { sql } from '@extensions/postgresql';
import { workflow, trigger } from '@january/declarative';

workflow('ListBlogsWorkflow', {
  tag: 'blogs',
  trigger: trigger.http({
    method: 'get',
    path: '/',
  }),
  execute: async ({ trigger }) => {
    const records = await sql`
        SELECT * FROM blogs
        WHERE title = '${trigger.query.title}'
      `;
    return records;
  },
});
```
