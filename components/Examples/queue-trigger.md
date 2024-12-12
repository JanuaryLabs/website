```ts
import { workflow, trigger } from '@january/declarative';

workflow('TransferPayment', {
  tag: 'payments_queue_name',
  trigger: trigger.queue({
    jobName: 'payments.transfer',
  }),
  execute: async job => {
    console.log('Transfering payment...', job.data.amount);
  },
});
```

<Footer
  gist="f34aca124fe48eabad26fbf4927e59fc"
>
  Uses BullMQ workers that processes jobs from a queue.
</Footer>
