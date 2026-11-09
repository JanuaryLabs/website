```ts
import { workflow, trigger, policy } from '@january/declarative';

feature('UsersFeature', {
  policies: {
    isAuthenticated: policy.authenticate(),
  },
  workflows: [
    workflow('GetUser', {
      trigger: trigger.http({
        policies: ['isAuthenticated'],
        method: 'get',
        path: '/user/:id',
      }),
      execute: async ({ trigger }) => {
        // do something
      },
    }),
  ],
});
```

<Footer
 gist="174d1a48e710d090ea1fd051dac723f2"
>
You can use the `authenticate` policy to ensure that the user is authenticated before they can access a workflow.
</Footer>
