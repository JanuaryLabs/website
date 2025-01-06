---
title: Tables
layout: learn
---

## Table

A table translates to the corresponding database extension table. Essentially, It is a collection of records that share the same structure. For example, a table named `orders` can have records with columns like `id`, `name`, `price`, etc.

Speaking in terms of the generated code. It is the ORM model that represents the table in the database.

You can define a table by using the `table` function.

```ts
feature('OrdersFeature', {
  workflows: [],
  tables: {
    orders: table({
      fields: {
        name: field.shortText(),
        price: field({ type: 'price' }),
      },
    }),
  },
});
```

Say you've installed a database extension that uses "TypeORM" then the above code will translates to

```ts
@Entity()
export class Orders {
  @Column()
  name: string;

  @Column()
  price: number;
}
```

The table function composed of the following elements:

1. Name that identifies the table.
2. Fields that define the columns of the table.

### What is a field?

A field is a column in the table. It defines the type of data that can be stored in the column and the validation rules that apply to the data.

```ts
field.longText();
```

There are two kind of fields:

- Semantic fields: These fields are used to store data that has a specific meaning and usually have implicit validation. For example, `short-text`, `email`, and `price`.
- Generic fields: These fields are used to store data that doesn't have a specific meaning. For example, `integer`, `decimal`, and `json`.

Semantical fields are common across all database extensions, while generic fields are specific to the database extension.

- `short-text`: A short text field that can store up to 255 characters.
- `long-text`: A free form field that can store up to the database limit.
- `email`: A field that stores an email address.
- `local-tel`: A field for storing local telephone numbers.
- `international-tel`: A field for storing international or local telephone numbers.
- `date`: A field for storing date values.
- `time`: A field for storing time values in the format hh:mm:ss.
- `datetime`: A field for storing combined date and time values.
- `password`: A field for storing passwords with validation for security.
- `url`: A field for storing URLs and validating their format.
- `boolean`: A field for storing boolean values (true or false).
- `percentage`: A field for storing percentage values with optional precision.
- `price`: A field for storing monetary values with currency precision.
- `latitude`: A field for storing latitude coordinates.
- `longitude`: A field for storing longitude coordinates.
- `uuid`: A field for storing universally unique identifiers (UUIDs).

The configuration for each field can be found in the installed database extension documentation.

### Primary and Audit fields

The compiler auto-generates the following fields in each table:

- `id`: A UUID field that serves as the primary key for each record.
- `createdAt`: A timestamp field that represents when the record was created.
- `updatedAt`: A timestamp field that represents the last time the record was updated.
- `deletedAt`: A timestamp field that indicates when the record was deleted (if applicable).

These fields are automatically added to each table and can be used in queries and other database operations.

#### Manually Specifying the primary key

This default primary key field can be overridden if you explicitly define a primary key using a different data type, such as number or string.

The primary key can be defined using the `field.primary()` declarative which takes two config values:

- `type`: One of `uuid`, `number`, `string`.
- `generated`: An optional boolean to indicate wether the primary key should be auto generated for new records.

Every table can have only one primary key, compound primary keys are currently not supported.

### Validations

Field validation is an essential feature in January Core that ensures data consistency and integrity by enforcing specific conditions on field values at the database level. In this section, we will delve into the details of field validation, its types, and provide practical examples.

The following list of validation declarations can be applied to a field:

- `mandatory()`: Ensures that the field is present and not empty (aka non nullable).

- `unique()`: Ensures that the field value is unique across all records in the table. a unique fields is also required.

You can also use the `index()` declarative to group two or more columns in a (unique) index.

#### Example 1: Nullable Field Validation

Suppose you have a `product` table with a `name` field, and you want to ensure that every product has a name. You can apply `mandatory()` validation to this field as follows:

```typescript
table('products', {
  fields: {
    name: field({ type: 'short-text', validations: [mandatory()] }),
  },
});
```

In this example, the `name` field is validated as not null, ensuring that every product has a name.

#### Example 2: Unique Field Validation

Suppose you have a `slug` field, and you want to ensure that every product has a unique. You can apply `unique()` validation to this field as follows:

```typescript
table('products', {
  fields: {
    slug: field({ type: 'short-text', validations: [unique()] }),
  },
});
```

In this example, the `name` field is validated as not null, ensuring that every product has a name.

#### Example 3: Compound Index Constraint

Now let's consider two tables, `products` and `orders`. Suppose you have an `order_items` table with a composite primary key composed of `product_id` and `order_id`, but you also want to ensure that the combination of these fields is unique across all records in the table. You can apply unique validation as follows:

```typescript
table('order_items', {
  fields: {
    product_id: field({ type: 'uuid' }),
    order_id: field({ type: 'uuid' }),
  },
  constraints: [index(useField('product_id'), useField('order_id'))],
});
```
