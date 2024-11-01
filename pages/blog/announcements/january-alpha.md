---
date: '2024-06-01T00:00:00.000'
category: announcements
title: 'Announcing January Alpha'
layout: blog-post
author: January Team
---

With great enthusiasm and excitement, we are thrilled to announce the January Alpha release. This is a significant milestone for us and the community. We have been working hard to bring you a new experience that will improve on the way you build and deploy APIs.

While initially focusing on a low-code platform, we quickly realized that this approach might not be optimal for most use cases. We've therefore developed a new version of January that strikes a balance between developer experience and low-code capabilities. This evolution moves us from a purely UI-driven approach to a more code-first methodology, offering the best of both worlds.

## What is January?

I still struggle to define January; when people from different backgrounds ask, it becomes difficult to convey its true essence.

So if you're a

- Developer:

> January is a product hosting "CanonLang" that lets you write a high-level, semantical description of the shape of the API in one place and generate code that you can deploy to your server.

- Freelancer:

> January is a platform that helps you build APIs quickly and efficiently for many clients. it supports multiple workspace and multiple projects all in one place while given you the freedom to handover the code to the client.

- Product Manager:

> January is a battery-included product that enables developers to build API quickly without compromising quality.

- Entrepreneur:

> January is your MVP's best friend. Build fast, iterate faster, and forget about the traditional development headaches.

- VC:

> January is a product that helps startups accelerate their development process and focus on their core business.

The definition of January is still evolving, and I'm particularly excited to see how you define it.

## All in one place

From the start, January has been about providing a complete API development experience in which you can build, integrate, test and deploy your APIs in one place to make the development process more efficient (less context switching) and enjoyable.

And I'm happy to say that we are getting closer to that vision with the release of January Alpha; The missing part was testing the API while you are developing it aka hot-reloading. For that we developed a little product on the side named "Serverize" which launches your API in a server maintained by January that provides production-like environment for you to test your API.

_The testing is done through swagger or something of similar interface (we're looking at scalar.dev) embedded in the January UI._

That is being said, we've made strategic decisions to postpone certain features for later development. These include managing secrets, monitoring, and logging. We believe these aspects are better handled by cloud providers or dedicated services, allowing us to focus on our core strengths.

## You can leave anytime

January functions as a source-to-source compiler, transforming CanonLang into Node.js code. That is **readable** and **maintainable**. This means you're never locked in. If you ever feel January is constraining your growth, you can simply transition to a traditional approach.

Your code lives in your own repository, always accessible and under your control. We've prioritized GitHub integration (with plans to support other providers in the future) due to the popularity of the platform and its developer built-in tools.

We're happy to have you with us for as long as you find value in January. Our goal is to support your growth, not limit it. So experiment, build, and know that your options are always open.

<!-- ## AI Assisted Development

We did experiment with an AI assistant that understands your code, the context of your project, the extensions you're using, and your requirements to provide you with suggestions, warnings, and improvements. -->

## The extension system

Initially, we designed our extension system with the principle that each extension should operate independently, without knowledge of the wider system or other extensions. However, we quickly discovered that this approach was not ideal, as it significantly increased the time and complexity of implementing new extensions.
In response to this challenge, we're transitioning to a more integrated system.

This new approach allows extensions to communicate with each other and interact with the core system, leading to a flexible development process.

Within just a month, we've successfully released several new extensions. More importantly, the process of building new extensions is becoming increasingly easier and simpler.

## Introducing CanonLang

The name **Canon** -Canon the second- is the Arabic word for January. It's January's language that we have been working on to bridge the gap between the UI and the code. Canon heavily relies on static analysis to provide real-time suggestions and warnings to the developer.

Technically speaking, CanonLang is an internal DSL built on top of TypeScript that provides declarative syntax to define APIs.

You can get something ready to run with very small amount of code. Here is an example of a complete API project:

```ts
import { saveEntity } from '@extensions/postgresql';
import { tables } from '@workspace/entities';

export default project(
  feature('Blog', {
    tables: {
      posts: table({
        fields: {
          title: field.shortText(),
          content: field.longText(),
          author: field.relation({
            references: useTable('authors'),
            relationship: 'many-to-one',
          }),
        },
      }),
      authors: table({
        fields: {
          name: field.shortText(),
          email: field({ type: 'email', validations: [unique()] }),
        },
      }),
    },
    workflows: [
      workflow('CreatePostWorkflow', {
        tag: 'posts',
        trigger: trigger.http({
          method: 'post',
          path: '/',
        }),
        execute: async ({ trigger }) => {
          await saveEntity(tables.posts, {
            title: trigger.body.title,
            content: trigger.body.content,
            author: trigger.body.author,
          });
        },
      }),
      workflow('AssignAuthorToPostWorkflow', {
        tag: 'posts',
        trigger: trigger.http({
          method: 'patch',
          path: '/:id',
        }),
        execute: async ({ trigger }) => {
          const qb = createQueryBuilder(tables.posts, 'posts').where(
            'id = :id',
            {
              id: trigger.path.id,
            }
          );
          await updateEntity(qb, {
            author: trigger.body.authorId,
          });
        },
      }),
    ],
  })
);
```

## Compiler as API

CanonLang isn't the only way to define your requirements. We're developing an SDK that enables communication with the compiler via REST API. This feature is particularly beneficial for companies building low-code -> UI, aiming to provide an end-to-end experience for their customers. e.g. Glide, Webflow, FlutterFlow, etc.

```ts
const table = sdk.defineTable({
  // ...
});

const workflow = sdk.defineWorkflow({
  // ...
});

const project = sdk.defineProject({
  tables: [table],
  workflows: [workflow],
});

await sdk.deploy(project);
```

## Wild Ideas

Naturally, CanonLang opens up a world of possibilities for automation frameworks, think of deploying specific workflows, with monitoring, logging, insights, and more, all in one go.

## Available today

January Alpha is available today for everyone. You don't need to sign up or anything, just go to [app.january.sh](https://app.january.sh) and start building your APIs.

## Open Source?

Yeah, we're heading towards open source, but not just yet. Maintaining an open-source project requires efforts and people, and we're not there yet. However, we're planning to open-source small parts of January, like the Autosave feature.

Right now, our main focus is getting the extension system battle-ready for devs to hack on and build with.

## Self Hosted?

I'm fan of self-hosted products and self hosting January is on our roadmap. We're planning to provide a self-hosted version of January for individuals and companies that require more control over their data and infrastructure.

## What about pricing?

January is free for now for everyone till we move past the beta stage. We are looking for feedback from the community to help us shape the future of the platform. We are also looking for contributors to help us build the next generation of APIs.

That is being said we provide **backend development services** for **Early stage startups**, **web agencies** and **niche businesses**.

You can contact us through:

- [Discord](https://discord.gg/CQCCpr3Xs7)
- [LinkedIn](https://linkedin.com/company/januarylabs)
- [Twitter](https://x.com/january_labs)
- [GitHub](https://github.com/januarylabs)
- [Email](mailto:chat@january.sh)

## The road ahead together

The launch of January Alpha is just the begaining, not the end. As we move forward our focus will be on researching how to make developing APIs reasonable and hopefully better guided by the feedback and insights of our customers and community.

Stay tuned for updates and the **BETA** announcements as we continue to innovate and improve CanonLang.

- AI assistant.
- Workflow store.
- Serverize.
- Magic connect.
- More integrations.

Let's build the next generation of APIs together!
