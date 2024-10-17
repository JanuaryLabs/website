---
title: Quick Start
layout: learn
---

## Developer Experience

Better developer experience is what January is all about. We want to make it as easy as possible for you to start writing business logic and building APIs.

To setup the database, you need to have a database server running locally which can be via either of the following methods:

### Docker Compose

The scaffolding process creates a `tools/compose.js` file that is pre-configured to run PostgreSQL and connect it with your node.js project.

- Open a terminal window and run the following command:

```bash
node tools/compose.js
```

Then run the following command to start docker compose:

```bash
docker compose \
  -f "compose.dev.yml" \
  up \
  --build \
  --watch \
  --remove-orphans
```

_This command uses docker `--watch` mode to automatically restart the server when you make changes._

---

January provides set of pre-configured images but you can always add yours through declarative like syntax.

```js
import {
  compose,
  localServer,
  pgadmin,
  postgres,
  service,
  writeCompose,
} from '@january/docker';

// Use DragonflyDB image as a Redis server
const redis = {
  image: 'docker.dragonflydb.io/dragonflydb/dragonfly',
  ports: ['6379:6379'],
  volumes: ['dragonflydata:/data'],
  environment: {
    REDIS_PASSWORD: 'password',
  },
};
writeCompose(
  compose({
    database: service(postgres),
    pgadmin: service(pgadmin),
    server: service({
      ...localServer(),
      depends_on: [postgres, redis],
    }),
    redis: service(redis),
  })
);
```
