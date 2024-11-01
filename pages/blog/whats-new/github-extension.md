---
date: '2024-04-24T17:45:00.000Z'
category: whats-new
title: 'Releasing Github Webhooks Extension'
layout: blog-post
author: ezzabuzaid
---

We're excited to announce GitHub Webhooks Extension, a new extension that allows you to trigger a workflow based on a event from a GitHub repositories directly in your January project.

With this extension, you can now:

- Automatically respond to events like push commits, pull requests, and issues.
- Easily set up and manage webhooks within your project.
- Connect your workflows with real-time updates from your GitHub repositories.

What can you do with this extension?

- Send notifications to your team when a new issue is created.
- Maintaining public issue-tracking boards while managing comminucation internally.
- Build community discussions boards that are powered by GitHub issues or GitHub discussions.

## How does it work?

It uses [Github Webhooks](https://github.com/octokit/webhooks.js) package to listen to events from a GitHub repository and broadcast them to the other parts of the project.

This package takes care of the low-level details of receiving and verifying webhook payloads from GitHub, and dispatching them to your code.

The setup looks similar to this:

```ts
const router = new Hono();

router.post('/github/webhooks', async (context, next) => {
  // ...
  const { processed, body, headers, statusCode } = await receiveGithubEvents(
    nodeContext.incoming,
    nodeContext.outgoing
  );
  // ...
});

export default ['/integrations', router] as const;
```

The listener part:

```ts
export function onGithubEvent<EventName extends EmitterWebhookEventName>(
  event: EventName,
  ...middlewares: ((
    event: EmitterWebhookEvent<EventName>
  ) => boolean | void | Promise<boolean | void>)[]
) {
  webhooks.on(event, async event => {
    for (const middleware of middlewares) {
      let canContinue = await middleware(event);
      if (canContinue === false) {
        break;
      }
    }
  });
}
```

A workflow that uses the extension would look like this:

```ts
// command file
export async function createPostWorkflowFromGithub({
  payload,
}: EmitterWebhookEvent<'issues.labeled'>) {
  const input = {
    title: payload.issue.title,
    description: payload.issue.body,
    issueUrl: payload.issue.url,
  };

  validateOrThrow(posts.createPostWorkflowFromGithubSchema, input);
  await posts.createPostWorkflowFromGithub(input);
}

// listener file
onGithubEvent('issues.labeled', listeners.createPostWorkflowFromGithub);
```

## How I can use it?

- Install the extension from within January.
- Create webhooks in the GitHub repository.
- Add the webhook secret as an environment variable in your project.
- The rest of details can be found in the documentation.

There are two parts to this extension:

1. **Triggers**
2. **Policies**

A simple example of a workflow that listens to a `issues.labeled` event and creates a new record in a database:

```ts
import { saveEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

feature('Roadmap', {
  workflows: [
    workflow('RecordIssuedLabeled', {
      tag: 'posts',
      trigger: trigger.github({
        event: 'issues.labeled',
      }),
      execute: async ({ trigger }) => {
        await saveEntity(tables.posts, {
          title: trigger.issue.title,
          description: trigger.issue.body,
          issueUrl: trigger.issue.url,
        });
      },
    }),
  ],
  tables: {
    posts: table({
      fields: {
        title: field.shortText(),
        description: field.longText(),
        issueUrl: field({ type: 'url' }),
      },
    }),
  },
});
```

Say, you only want to save the issue if it's labeled with `bug`:

```ts
feature('Roadmap', {
  policies: {
    isRoadmapIssue: policy.github<'issues.labeled'>(payload => {
      return payload.label?.name === 'bug';
    }),
  },
  workflows: [
    workflow('RecordIssuedLabeled', {
      tag: 'posts',
      trigger: trigger.github({
        event: 'issues.labeled',
        policies: ['isRoadmapIssue'],
      }),
      // ...
    }),
  ],
  tables: {
    // ...
  },
});
```

## Get Involved

You can try it out today in the [playground](https://app.january.sh/). We’re always happy to hear your feedback.

Looking to the future, January team is running a survey to gather info from the ecosystem to help shape the API development sphere. If you have a minute, please [fill out the survey](https://tally.so/r/31KZAg).

## What's next?

- [ ] Support for more than one webhook per project.
- [ ] [Listening to multiple events in a single workflow](https://github.com/JanuaryLabs/.github/issues/2).
- [ ] Add Github octokit to the extension to interact with the GitHub API.
