---
title: Extensions
layout: learn
---

## Extensions

An extension provide additional functionalities such as database operations, sending emails, upload files and interacting with external services.

Extensions are designed to be easy to install, use, and remove. Offering a wide range of functionality for workflows, actions and policies. Some extensions requires setting up environment variables and build variables like deployment and auth extensions.

Extensions also can be dependable on other extensions, for example, the `typeorm` extension is required to use the `database` extension.

### User-Defined Extensions

January now supports user-defined extensions that can be added to your project, allowing you to extend functionality without modifying the core library. This feature enables project-specific customization through a simple process.

#### How User-Defined Extensions Work

To create a user-defined extension:

1. **Create an extension directory**: Create a new directory in `src/extensions` named after your extension.
2. **Implement the extension**: Implement your extension using January's extension API. TypeScript is recommended for implementation.
3. **Import and use the extension**: Import and use your extension exports in `src/project.ts` from `@extensions/<extension-name>`.

#### Benefits of user-defined Extensions

- **Modular, reusable code**: All extensions are modular, reusable, and easily integrated into your project.
- **Easy customization**: Create custom utilities and integrations tailored to your project's needs.
