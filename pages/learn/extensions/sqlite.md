---
title: SQLite Extension
layout: learn
---

## SQLite Extension

SQLite extension is a database extension that allows you to interact with a SQLite database.

### Setup

Update `january.config.js` file to include the following:

```ts
import { sqlite } from '@january/extensions/sqlite';

export default defineConfig({
  extensions: [
    // ... other extensions
    sqlite(),
  ],
});
```

#### Environment Variables

This extensions accepts the following environment variables:

```txt
CONNECTION_STRING=The connection string to the PostgreSQL database.
ORM_MIGRATIONS_RUN=Whether to run migrations or not. Default is false.
ORM_LOGGING=Whether to log queries or not. Default is false.
ORM_SYNCHRONIZE=Whether to synchronize the database schema or not. Default is false.
```

#### Production

SQLite is a file-based database which means you have to make sure that the file is accessible by the application (give proper permissions when running inside docker container).

The recommnedation for production is to use a hosted database service like [TursoDB](https://www.turso.tech) to host your SQLite database. That's being said if you want to host the SQLite database on your own server then you should mount it to a named volume so that the data is persisted even when the container is removed.

To put it more precisely, the recommendation in order is as follows:

- Use something like [Turso](https://www.turso.tech) to host your SQLite database.
- Mount an _object storage_ to the container to store the SQLite database completely outside the server.
- Use a named volume to store the SQLite database on the server yet outside the container.

From the application perspective it needs the following environment variables:

```txt
CONNECTION_STRING=The file path to the SQLite database
```

For example:

```txt
CONNECTION_STRING=/data/my-app-database.sqlite
```

in the `docker-compose.yml` file:

```yml
services:
  my-app:
    image: my-app
    volumes:
      - my-app-data:/data
    environment:
      CONNECTION_STRING: /data/my-app-database.sqlite

volumes:
  my-app-data:
```

#### Development

In development it's fine to use SQLite database file on your local machine. You can set the `CONNECTION_STRING` environment variable to the path of the SQLite database file.

```txt
CONNECTION_STRING=./my-app-database.sqlite
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
} from '@extensions/sqlite';
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
} from '@extensions/sqlite';
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
} from '@extensions/sqlite';
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
import { saveEntity } from '@extensions/sqlite';
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
import { createQueryBuilder, updateEntity } from '@extensions/sqlite';
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
import { createQueryBuilder, removeEntity } from '@extensions/sqlite';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('id = :id', {
  id: trigger.path.id,
});

await removeEntity(qb);
```

This function will delete one blog that has the id from the request path.

**Delete all blogs**:

```ts
import { createQueryBuilder, removeEntity } from '@extensions/sqlite';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs');
await removeEntity(qb);
```

Be careful with this fuction as it will delete all records in the `Blogs` table.

#### Exists

Check if at least one record exists in a table given a query.

**Check if a blog exists**:

```ts
import { createQueryBuilder, exists } from '@extensions/sqlite';
import { tables } from '@workspace/entities';

const qb = createQueryBuilder(tables.blogs, 'blogs').where('id = :id', {
  id: trigger.path.id,
});
const exists = await exists(qb);
```

**Check if a blog exists by title**:

```ts
import { createQueryBuilder } from '@extensions/sqlite';
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
import { createQueryBuilder, upsertEntity } from '@extensions/sqlite';
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
import { createQueryBuilder, upsertEntity } from '@extensions/sqlite';

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
import { createQueryBuilder, upsertEntity } from '@extensions/sqlite';

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
import { createQueryBuilder, execute } from '@extensions/sqlite';

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
import { createQueryBuilder, increment } from '@extensions/sqlite';
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
import { createQueryBuilder, decrement } from '@extensions/sqlite';
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
import { sql } from '@extensions/sqlite';
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
