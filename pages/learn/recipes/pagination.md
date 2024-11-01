---
title: Pagination
layout: learn
---

## Pagination

Database extensions (postgresql, turso, sqlite, etc.) include utilities to retrieve data in manageable chunks, a process called pagination. It improves application performance by reducing the amount of data loaded at once, which helps minimize memory usage, speeds up response times, and creates a smoother user experience.

Assuming we have the following feature:

```ts
export default feature({
  tables: {
    blogs: table({
      fields: {
        title: field.shortText(),
        content: field.longText(),
      },
    }),
  },
  workflows: [],
});
```

### Limit Offset Pagination

Limit Offset Pagination allows you to specify the number of items per page (`pageSize`) and the starting point (`pageSize * pageNo`). For example, you could set `pageSize: 10` and `pageNo: 2` to retrieve items starting from the 21st record.

```ts
import {
  createQueryBuilder,
  deferredJoinPagination,
  limitOffsetPagination,
  cursorPagination,
  execute,
} from '@extensions/postgresql';

export default feature({
  workflows: [
    workflow('ListBlogsWorkflow', {
      tag: 'blogs',
      trigger: trigger.http({
        method: 'get',
        path: '/',
        input: trigger => ({
          pageSize: {
            select: trigger.query.pageSize,
            against: z.number().int().min(1).max(50).optional(),
          },
          pageNo: {
            select: trigger.query.pageNo,
            against: z.number().int().min(1).optional(),
          },
        }),
      }),
      execute: async ({ input }) => {
        const qb = createQueryBuilder(tables.blogs, 'blogs');
        const paginationMetadata = limitOffsetPagination(qb, {
          pageSize: input.pageSize,
          pageNo: input.pageNo,
          count: await qb.getCount(),
        });
        const records = await execute(qb);
        return {
          meta: paginationMetadata(records),
          records: records,
        };
      },
    }),
  ],
});
```

This code uses `limitOffsetPagination` to get a page of blog posts. It ensures the page size and number are reasonable to avoid overloading the server.

### Deferred Joins Pagination

Deferred Joins Pagination first selects primary keys with an initial query and then joins with itself to retrieve the remaining columns.

```sql
select * from blogs          -- The full data that you want to show your users.
    inner join (                -- The "deferred join."
        select id from blogs -- The pagination using a fast index.
            order by id
            limit 15 offset 150000
    ) as tmp using(id)
order by id                     -- Order the single resulting page as well.
```

[Reference](https://aaronfrancis.com/2022/efficient-mysql-pagination-using-deferred-joins-15d0de14)

```ts
export default feature({
  workflows: [
    workflow('ListBlogsWorkflow', {
      tag: 'blogs',
      trigger: trigger.http({
        method: 'get',
        path: '/',
        input: trigger => ({
          pageSize: {
            select: trigger.query.pageSize,
            against: z.number().int().min(1).max(50).optional(),
          },
          pageNo: {
            select: trigger.query.pageNo,
            against: z.number().int().min(1).optional(),
          },
        }),
      }),
      execute: async ({ input }) => {
        const qb = createQueryBuilder(tables.blogs, 'blogs');
        const paginationMetadata = deferredJoinPagination(qb, {
          pageSize: input.pageSize,
          pageNo: input.pageNo,
          count: await qb.getCount(),
        });
        const records = await execute(qb);
        return {
          meta: paginationMetadata(records),
          records: records,
        };
      },
    }),
  ],
});
```

Deferred Joins are best for large tables.

### Cursor Pagination

Cursor Pagination uses a cursor—a reference to a specific point in the data—to fetch the next set of records. This method avoids the overhead of skipping records and scanning through all preceding rows.

```ts
export default feature({
  workflows: [
    workflow('ListBlogsWorkflow', {
      tag: 'blogs',
      trigger: trigger.http({
        method: 'get',
        path: '/',
        input: trigger => ({
          pageSize: {
            select: trigger.query.pageSize,
            against: z.number().int().min(1).max(50).optional(),
          },
          cursor: {
            select: trigger.query.cursor,
            against: z.string().optional(),
        }),
      }),
      execute: async ({ input }) => {
        const qb = createQueryBuilder(tables.blogs, 'blogs');
        const paginationMetadata = cursorPagination(qb, {
          pageSize: input.pageSize,
          cursor: input.cursor,
          count: await qb.getCount(),
        });
        const records = await execute(qb);
        return {
          meta: paginationMetadata(records),
          records: records,
        };
      },
    }),
  ],
});
```

Notice that it doesn't use `pageNo`. Instead, Cursor Pagination uses a `cursor` to fetch records.

Note: Cursor Pagination is experimental and may not work.

Each pagination strategy has its benefits. Limit Offset is simple, Deferred Joins is efficient for big tables, and Cursor Pagination is for tables with frequent updates.
