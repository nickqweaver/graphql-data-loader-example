# GraphQL DataLoader Performance Demo

This project demonstrates the performance benefits of using DataLoader in GraphQL applications to address the N+1 query problem.

## Overview

When fetching nested data in GraphQL, a naive implementation can lead to the N+1 query problem - where retrieving a list of items results in additional database queries for each related entity. This demo showcases side-by-side comparisons of:

1. **Standard GraphQL resolvers** - Direct database queries that suffer from N+1 issues
2. **DataLoader-enhanced resolvers** - Batched and cached queries for significant performance improvements

## Schema Structure

The schema consists of products with related entities:

- **Products** - Main entity with relationships to category, stock, and manufacturer
- **Categories** - Each connected to multiple products
- **Stock Information** - Inventory details for each product
- **Manufacturers** - Companies that make products

Each entity exists in two versions in the schema:

- Standard version (`Product`, `Category`, etc.)
- DataLoader version (`DataLoaderProduct`, `DataLoaderCategory`, etc.)

## Key Features

- **Dual Implementation**: Compare standard vs. DataLoader queries with identical data models
- **Performance Metrics**: Visualize the difference in query time and database load
- **Configurable Seed Data**: Generate test data of varying sizes to observe scaling effects
- **Database Management**: Easily reset the database between test runs

## How to Use

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Seeding the Database

Use the GraphQL mutation to generate test data:

```graphql
mutation {
  seedDatabase(
    input: {
      categoriesCount: 5
      manufacturersPerCategory: 3
      productsPerManufacturer: 10
    }
  )
}
```

### Running Test Queries

#### Standard Query (with N+1 problem)

```graphql
query {
  categories {
    id
    name
    products {
      id
      name
      price
      manufacturer {
        id
        name
        country
        rating
      }
      stock {
        quantity
        location
        lastUpdated
      }
    }
  }
}
```

#### DataLoader Query (optimized)

```graphql
query {
  categoriesDataLoaded {
    id
    name
    products {
      id
      name
      price
      manufacturer {
        id
        name
        country
        rating
      }
      stock {
        quantity
        location
        lastUpdated
      }
    }
  }
}
```

### Resetting the Database

```graphql
mutation {
  wipeDatabase
}
```

## Why DataLoader Makes a Difference

### The N+1 Problem

In the standard implementation:

1. Initial query fetches a list of categories (1 query)
2. For each category, a query fetches its products (N queries)
3. For each product, additional queries fetch manufacturer and stock data (N × 2 queries)

This creates a multiplicative explosion of database requests as the data scales.

### DataLoader Solution

DataLoader addresses this by:

1. **Batching**: Collecting individual requests into a single efficient database query
2. **Caching**: Remembering results to prevent duplicate queries for the same entity
3. **Optimization**: Transforming inefficient nested queries into efficient batch operations

## Performance Comparison

With a modestly sized dataset (e.g., 5 categories, 3 manufacturers per category, 10 products per manufacturer):

| Implementation | Database Queries | Approximate Query Time |
| -------------- | ---------------- | ---------------------- |
| Standard       | 150+             | 500-1000ms             |
| DataLoader     | ~4               | 50-100ms               |

The performance gap widens dramatically as the dataset size increases.

## Implementation Notes

The demo uses:

- GraphQL for the API layer
- DataLoader for query optimization
- A simple database backend (details in code)

## Next Steps

After exploring this demo, consider:

- Implementing DataLoader in your own GraphQL services
- Experimenting with different batch sizes and caching strategies
- Adding monitoring to track query performance in production

## License

[MIT]
