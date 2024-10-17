---
title: About January
layout: about
---

# About January

January is an API development platform designed to simplify the process of creating and running APIs by leveraging a powerful declarative language that integrates various tools and services, acting as an intermediary between business logic and server-side code.

```ts
import { saveEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

workflow('HelloWorld', {
  tag: 'example',
  trigger: trigger.http({
    method: 'post',
    path: '/hello',
  }),
  execute: async ({ trigger }) => {
    await saveEntity(tables.greetings, {
      message: trigger.body.message,
    });
  },
});
```

_This workflow uses an HTTP routing extension (such as hono.dev, express.js, etc.) and a database extension (such as PostgreSQL, MySQL, etc.) to create a fully functional API. It listens for POST requests on the `/example/hello` endpoint and inserts the message from the request body into a database table called `greetings`. The resulting Node.js code is pushed to a Git repository and can be deployed to a server through a deployment extension (such as Serverize, Fly.io, Vercel, etc.)._

January differs from traditional API development by abstracting imperative code and boilerplate, focusing on business logic with a "What to do" rather than "How to do it" approach. Furthermore, traditional development tends to be complex and resource-inefficient due to the numerous tools and services that need integration and maintenance. Through extensions, January simplifies this process by focusing on use-cases rather than specific tools.

```ts
trigger.schedule({
  pattern: '0 0 * * *',
});
```

This trigger is available through a scheduling extension (such as node-cron, bullmq, etc.), and moving from one library to another doesn't require changing the workflow, only the extension; January itself doesn't provide abstraction primitives but uses the code to provide instructions to the compiler to generate the necessary code.

---

Key features:

- **Portability**
  GitHub, a first-class citizen of January, emphasizes portability as a key feature and serves as a platform for deploying and hosting the resulting code, allowing you to take and customize it as you see fit, ensuring your code is always accessible and version-controlled.

- **In-App Testing**
  Production-like testing server to run the API directly from the platform without having to deploy prior using Swagger interface (Scalar.dev).

- **Extensions**
  A wide range of extensions to interact with various services and tools, such as databases, HTTP routing, deployment, and more.

- **Declarative Language**
  A declarative language (TypeScript internal DSL) that emphasizes colocating business logic with all the necessary components to run it.

[blocking vs. non-blocking]: /learn/asynchronous-work/overview-of-blocking-vs-non-blocking
[`child_process.fork()`]: https://nodejs.org/api/child_process.html
[`cluster`]: https://nodejs.org/api/cluster.html
[event machine]: https://github.com/eventmachine/eventmachine
[twisted]: https://twisted.org/
