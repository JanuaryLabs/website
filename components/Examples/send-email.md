```ts
workflow('AddUserWorkflow', {
  tag: 'users',
  trigger: trigger.http({
    path: '/',
    method: 'post',
  }),
  actions: {
    sendWelcomEmail: action.resend.sendEmail({
      to: '@trigger:body.email',
      from: 'welcom@org.com',
      subject: 'Welcome dear user',
      html: '<p>Welcome to January! You have successfully signed up.</p>',
    }),
  },
});
```

You can send an email using the `sendEmail` action. This action is available in the email extension. This example uses Resend.com extension.