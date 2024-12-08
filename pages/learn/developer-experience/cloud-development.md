---
title: Cloud Development
layout: learn
---

## Cloud Development

January integrates seamlessly with Serverize, a real-time development-to-cloud pipeline that automates the deployment of local changes without waiting for a traditional CI/CD cycle. With Serverize, developers can push updates directly from their local environment using Docker-based containers, making it an ideal tool for small teams who need to deploy fast iterations with minimal DevOps overhead.

### Key Benefits

- Real-time development-to-cloud pipeline
- Automated deployment of local changes
- No waiting for traditional CI/CD cycle
- Ideal for small teams and fast iterations

### Getting Started with Serverize and January

To get started, create the following `Dockerfile` inside your January app `output` directory:

```dockerfile
# Stage 1: Install dependencies
FROM node:alpine AS install

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit

# Stage 2: Build final image
FROM install AS run

WORKDIR /app
COPY --from=install /app/node_modules ./node_modules
COPY ./build .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

```

Then simply run the command `npx serverize@latest --app output deploy` inside your project directory to deploy your January setup to the cloud. You can also use watch mode by adding the `--watch` flag, which is especially useful for small teams who need to deploy fast iterations.

## Optimizing Your Workflow with Serverize and January

To make the most of watch mode, it's crucial to minimize what gets sent to the cloud. For example, instead of installing node_modules inside the Dockerfile, bundle your code beforehand and copy only the bundled files. This will keep your workflow fast and your updates efficient.

## Monitoring, Logs Management, and More

While Serverize and January provide a powerful combination for cloud development, there's still more to explore. Be sure to check out our guides on monitoring, logs management, Docker compose, volumes, and more to take your development experience to the next level.
