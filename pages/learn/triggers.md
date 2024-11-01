---
title: Triggers
layout: learn
---

## Triggers

Triggers are used to start workflows based on specific events or conditions.

- HTTP
- Stream
- SSE
- Websocket
- Github
- Schedule

### SSE

The `sse` trigger is used to trigger workflows based on Server-Sent Events (SSE). You can specify the path to match against.

```ts
import { PassThrough } from 'stream';

workflow('StreamSSE', {
  trigger: trigger.sse({
    path: '/',
  }),
  execute: async ({ trigger }) => {
    const { channel } = trigger.query;
    const stream = new PassThrough();
    setInterval(() => {
      stream.push(`data: ${channel}\n\n`);
    }, 1000);
    return stream;
  },
});
```

### Websocket

The `websocket` trigger is used to trigger workflows based on WebSocket connections. You can specify the path and topic to match against.

```ts
workflow('StreamWebsocket', {
  trigger: trigger.websocket({
    path: '/',
    topic: 'chat',
  }),
  execute: async ({ trigger }) => {
    const { channel } = trigger.query;
    const stream = new PassThrough();
    setInterval(() => {
      stream.push(`data: ${channel}\n\n`);
    }, 1000);
    return stream;
  },
});
```

### Github

The `github` trigger is used to trigger workflows based on GitHub webhooks. You can specify the event type to match against.

```ts
trigger.github({
  event: 'pull_request',
});
```

### Schedule

The `schedule` trigger is used to trigger workflows based on a schedule. You can specify the cron expression to match against.

```ts
trigger.schedule({
  pattern: '* 1 * * * *',
});
```
