```ts
import { trigger, workflow } from '@january/declarative';

workflow('ReportServerHealth', {
  tag: 'posts',
  trigger: trigger.schedule({
    pattern: '0 0 * * *', // at midnight
  }),
  execute: async () => {
    // do something
  },
});
```

<Footer>
Schedules a workflow to run at a specific time or at regular intervals.
</Footer>
