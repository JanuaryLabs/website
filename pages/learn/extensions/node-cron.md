---
title: Node Cron Extension
layout: learn
---

## Node Cron Extension

The Node Cron extension is one of the scheduling extensions that allows you to trigger workflows at specific times using cron expressions.

Limitation:

- By design this extension is not suitable for horizontal scaling, as it uses in-memory storage to keep track of the cron jobs.
- You can only schedule a task statically using a cron expression.

Beware that this scheduling extension is not suitable for serverless environments.

## Configuration

To use the Node Cron extension, you need to configure the cron expression and the workflow you want to trigger.

### Settings

#### Environment Variables

No environment variables are required for this extension.

#### Build Variables

No build variables for this extension.

### Triggers

The Node Cron extension triggers a workflow at a specific time using a cron expression.

```ts
trigger.schedule({
  pattern: '0 0 * * *',
});
```

This sample code triggers the workflow every day at midnight.

Usage within a workflow:

```ts
workflow('ReportServerHealth', {
  tag: 'posts',
  trigger: trigger.schedule({
    pattern: '0 0 * * *',
  }),
  execute: async () => {
    // do something
  },
});
```
