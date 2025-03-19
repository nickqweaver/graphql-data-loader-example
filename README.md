# GraphQL DataLoader Example

This repository provides a practical demonstration of using DataLoader with GraphQL to solve the N+1 query problem. It serves as a companion to my [blog article](https://nickweaver.dev/blog/why-you-need-data-loaders) about DataLoaders.

## About

The N+1 query problem is a common performance issue in GraphQL applications. When fetching nested data, a naive implementation can lead to making N additional database queries after the initial query - one for each related entity. DataLoader solves this by:

1. **Batching** - Collecting individual database requests into a single efficient query
2. **Caching** - Remembering results to prevent duplicate queries

This project demonstrates side-by-side implementations of GraphQL resolvers with and without DataLoader, allowing you to see the performance difference yourself.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd graphql-dataloader-example

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the development server
npm run dev
```

The Apollo Server will start on http://localhost:4000, providing a GraphiQL interface.

## Using the Example

### Seeding the Database

Before querying, seed the database with test data using the GraphQL mutation:

```graphql
mutation {
  seedDatabase(
    input: {
      categoriesCount: 5
      totalManufactures: 15
      productsPerCategory: 10
    }
  ) {
    success
    message
  }
}
```

This mutation creates categories, manufacturers, products, and stock information with random data.

### Clearing the Database

You can flush the database at any time with this mutation:

```graphql
mutation {
  flushDatabase {
    success
    message
  }
}
```

### Querying Without DataLoader (N+1 Problem)

To see the N+1 problem in action, run this query:

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

This query will perform:

- 1 query to get all categories
- N queries to get products for each category
- N queries for each product's manufacturer
- N queries for each product's stock information

#### Observing the N+1 Problem in Action

When you run the standard query above:

1. Watch your terminal console as the query executes
2. You'll see a large number of individual SQL queries being logged
3. The queries will follow this pattern:
   - One query for selecting all categories
   - Separate queries for each category's products
   - Separate queries for each product's manufacturer
   - Separate queries for each product's stock information

The total number of queries will be 1 + N + N + N, where N is the number of records at each level. This clearly demonstrates why the N+1 problem is a performance concern.

### Querying With DataLoader (Optimized)

Now run the same query using the DataLoader-optimized resolvers:

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

This version uses DataLoader to batch and cache the queries, reducing the number of database operations significantly.

## Benchmarking Performance

A benchmark script is included to measure the performance difference:

```bash
# Run the benchmark
ts-node scripts/benchmark-gql.ts
```

This script runs the query multiple times and records the response times for comparison. Results are saved to `dataloader_benchmark_results.csv`.

## How It Works

This example uses:

- **Apollo Server** for the GraphQL API
- **DataLoader** library to implement batching
- **Drizzle ORM** with SQLite for data storage

The project implements parallel GraphQL types for both standard and DataLoader-enhanced resolvers:

- `Category` vs `DataLoaderCategory`
- `Product` vs `DataLoaderProduct`
- etc.

The key difference is in the resolver implementation:

- Standard resolvers make individual database queries
- DataLoader resolvers use batch functions to collect, combine, and cache queries

### SQL Query Logging

By default, SQL query logging is enabled so you can see the database queries being executed in real-time. When you run queries through GraphiQL, watch your terminal to see:

1. How many database queries are being executed
2. The exact SQL being run
3. The timing for each query

This makes it easy to visualize the difference between standard and DataLoader-enhanced resolvers.

If you want to disable query logging, you can edit the `src/db/index.ts` file and set the `logger` option to `false`:

```typescript
// Change this:
export const db = drizzle(client, { schema, logger: true });

// To this:
export const db = drizzle(client, { schema, logger: false });
```

## Understanding the Code

Key files:

- `src/data-loaders/` - Contains DataLoader implementation
- `src/graphql/resolvers.ts` - Contains both standard and DataLoader resolvers
- `src/db/schema.ts` - Database schema definition
- `scripts/benchmark-gql.ts` - Benchmarking script

## License

MIT

