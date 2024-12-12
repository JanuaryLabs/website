```ts
import { on } from 'node:stream';
import { merge } from 'rxjs';
import { workflow, trigger } from '@january/declarative';

workflow('StreamErrors', {
  tag: 'realtime',
  trigger: trigger.websocket({
    topic: 'chat',
  }),
  execute: async ({ trigger }) => {
    return merge(
      on(process, 'uncaughtException'),
      on(process, 'unhandledRejection')
    );
  },
});
```

<Footer
  gist="f34aca124fe48eabad26fbf4927e59fc"
>
  Create an API endpoint that can be accessed via an HTTP request using the
  `trigger.http` trigger.
</Footer>
