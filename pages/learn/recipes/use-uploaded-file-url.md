---
title: Use Uploaded File URL
layout: learn
---

## Create a workflow that uploads a file and saves the URL to posts table

In this recipe, we will create a workflow that uploads a file to Google Cloud Storage and saves the URL to the posts table.

- Define a "posts" table with a "cover" field of type "url".

```ts
import { createQueryBuilder, updateEntity } from '@extensions/postgresql';
export default project(
  feature('Blog', {
    workflows: [],
    tables: {
      posts: table({
        fields: {
          title: field.shortText(),
          cover: field({ type: 'url' }),
        },
      }),
    },
  })
);
```

- Create a workflow with a trigger that accepts a file and an ID.

```ts
import { upload } from '@extensions/gcs';
import { createQueryBuilder, updateEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

export default project(
  feature('Blog', {
    tables: {
      // ...
    },
    workflows: [
      workflow('UploadPostCoverWorkflow', {
        tag: 'tasks',
        trigger: trigger.http({
          method: 'post',
          path: '/:id',
        }),
        execute: async ({ trigger }, request) => {
          const qb = createQueryBuilder(tables.posts, 'posts').where(
            'id = :id',
            { id: trigger.path.id }
          );
          const [url] = await upload(request, {
            maxFileSize: '5mb',
          });
          await updateEntity(qb, {
            cover: url,
          });
        },
      }),
    ],
  })
);
```

In this example, the fileUrl is returned from the uploadFile action and saved to the cover field of the post with the ID specified in the trigger path.

The `action.googleCloudStorage.uploadSingle` action expects multipart/form-data with a field.

Complete code:

```ts
import { createQueryBuilder, updateEntity } from '@extensions/postgresql';
import { upload } from '@extensions/gcs';

export default project(
  feature('blogs', {
    workflows: [
      workflow('UploadPostCoverWorkflow', {
        tag: 'tasks',
        trigger: trigger.http({
          method: 'post',
          path: '/:id',
        }),
        execute: async ({ trigger }) => {
          const qb = createQueryBuilder(tables.posts, 'posts').where(
            'id = :id',
            {
              id: trigger.path.id,
            }
          );
          const [url] = await upload({
            maxFileSize: '5mb',
          });
          await updateEntity(qb, {
            cover: url,
          });
        },
      }),
    ],
    tables: {
      posts: table({
        fields: {
          title: field.shortText(),
          cover: field({ type: 'url' }),
        },
      }),
    },
  })
);
```
