---
title: Relations
layout: learn
---

# Relations

Relations allow you to define relationships between tables, They are defined by using the built-in `field.relation()`.

To use the `field.relation()` function in your table, you must specify these props in the argument object:

- `references`: Here you specify the table to which this column reference using the built-in `useTable()` passing the table name as argument.
- `relationship`: One of `one-to-one`, `many-to-one`.

You can also pass a `validations` array which currently accepts the built-in `mandatory()` and `unique()`.

**Example 1: One-To-One Relation**

Suppose you have two tables, `person` and `address`. You want to establish a one-to-one relation between them.

```typescript
tables: {
    person: table({
        fields: {
            name: field.shortText(),
            address: field.relation({ references: useTable('address'), relationship: 'one-to-one' }),
        },
    }),
    address: table({
        fields: {
            street: field.longText(),
            city: field.shortText(),
        },
    }),
}
```

In this example, the `person` table has a field called `address`, which is related to the `address` table. Since it's a one-to-one relation, each person can have only one address.

**Example 2: Many-To-One Relation**

Now let's consider two tables, `list` and `item`. You want to establish a many-to-one relation between them.

```typescript
tables: {
    list: table({
        fields: {
            name: field.shortText(),
        },
    }),
    item: table({
        fields: {
            description: field.longText(),
            list: field.relation({ references: useTable('list'), relationship: 'many-to-one' }),
        },
    }),
}
```

In this case, each list can have multiple items, but each item belongs to only one list. The `list` field in the `item` table establishes this many-to-one relation.

**Example 3: Many-To-Many Relation**

To establish a many-to-many relation between two tables, you need a junction table. Let's take two tables, `list` and `item`, as an example.

```typescript
tables: {
    list: table({
        fields: {
            name: field.shortText(),
        },
    }),
    item: table({
        fields: {
            description: field.longText(),
        },
    }),
    listItemLink: table({
        fields: {
            item: field.relation({ references: useTable('item'), relationship: 'many-to-one' }),
            list: field.relation({ references: useTable('list'), relationship: 'many-to-one' }),
        },
    }),
}
```

In this scenario, the `listItemLink` table serves as a junction between `list` and `item`. Each item can be associated with multiple lists, and each list can have multiple items. The `item` and `list` fields in the `listItemLink` table establish the many-to-many relation.
