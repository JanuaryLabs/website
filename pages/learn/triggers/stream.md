---
title: HTTP Trigger
layout: learn
---

## Stream Trigger

The stream trigger is an HTTP-based trigger that the response in a stream rather than at once.

```ts
workflow('StreamOne', {
  tag: 'ask',
  trigger: trigger.stream({
    path: '/',
    method: 'post',
    input: trigger => ({
      message: {
        select: trigger.body.message,
        against: z.string(),
      },
    }),
  }),
  execute: async ({ input }) => {
    const duplex = new PassThrough();
    setInterval(() => {
      duplex.write(crypto.randomUUID());
    }, 500);
    return duplex;
  },
});
```
