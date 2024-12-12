---
title: HTTP Trigger
layout: learn
---

## Queue Trigger

The queue trigger enables you to listen to a queue and execute a workflow when a job is received.

```ts
import { trigger, workflow } from '@january/declarative';
workflow('ScheduleOrder', {
  tag: 'order_queue_name',
  trigger: trigger.queue({
    jobName: 'order.schedule',
  }),
  execute: async () => {
    console.log('Order scheduled');
  },
});
```

## Installation

Queue trigger is available through "BullMQ" offical extension.

Update `january.config.js` file to include the following:

```js
import { bullmq } from '@january/extensions/bullmq';

export default defineConfig({
  extensions: [
    // ... other extensions
    bullmq(),
  ],
});
```

## How it works

The queue trigger uses the BullMQ library to process jobs from a queue. When a job is received, the workflow is executed.

## How to use it?

There are few ways to define when the workflow should be triggered:

- On any job
- Specific job name
- List of job names
- On job status

### Trigger On Job Status

To trigger a workflow based on job status, use the status option. The supported job statuses include completed, failed, waiting, and others as defined in BullMQ. Here's an example:

ts
Copy code

_Note: You cannot have both status and name unless you set local to true_

```ts
import { trigger, workflow } from '@january/declarative';

workflow('MonitorOrder', {
  tag: 'order_queue_name',
  trigger: trigger.queue({
    status: 'completed',
  }),
  execute: async job => {
    console.log(`Order ${job.id} has been completed`);
  },
});
```

### Trigger On Job Status and Name

If you need to trigger a workflow based on both job name and status, set the local property to true. This ensures that the trigger only listens to jobs matching both criteria.

Keep in mind that this listens to the worker's events behind the scenes which means Jobs with same name that is handled by different workers will not be listened to.

```ts
import { trigger, workflow } from '@january/declarative';

workflow('AlertOrderFailure', {
  tag: 'order_queue_name',
  trigger: trigger.queue({
    jobName: 'order.process',
    status: 'failed',
    local: true,
  }),
  execute: async ([job]) => {
    console.error(`Order ${job.id} failed`);
  },
});
```

### Handling Multiple Job Names

You can provide an array of job names to the jobName property, allowing workflows to respond to multiple jobs.

```ts
import { trigger, workflow } from '@january/declarative';

workflow('ProcessOrderAndShipment', {
  tag: 'order_queue_name',
  trigger: trigger.queue({
    jobName: ['order.process', 'order.ship'],
  }),
  execute: async job => {
    console.log(`Job ${job.name} with ID ${job.id} executed`);
  },
});
```

<!--
## Retriving a Job in global listener

Sometimes you want to listen to the queue events globally and not just that speciefic workflow. By default BullMQ does not provide the job data in the queue event listener. To get the job data you can use the following code:

```ts
import { trigger, workflow } from '@january/declarative';

// TODO: add an example of queue configuration that keeps the job and fetch it in the listener
``` -->
