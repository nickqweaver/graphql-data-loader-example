import { gql } from "apollo-server";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: Category!
    stock: StockInfo!
    manufacturer: Manufacturer!
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }

  type StockInfo {
    id: ID!
    product: Product!
    quantity: Int!
    location: String!
    lastUpdated: String!
  }

  type Manufacturer {
    id: ID!
    name: String!
    country: String!
    products: [Product!]!
    rating: Float!
  }

  type DataLoaderProduct {
    id: ID!
    name: String!
    price: Float!
    category: DataLoaderCategory!
    stock: DataLoaderStockInfo!
    manufacturer: DataLoaderManufacturer!
  }

  type DataLoaderCategory {
    id: ID!
    name: String!
    products: [DataLoaderProduct!]!
  }

  type DataLoaderStockInfo {
    id: ID!
    product: DataLoaderProduct!
    quantity: Int!
    location: String!
    lastUpdated: String!
  }

  type DataLoaderManufacturer {
    id: ID!
    name: String!
    country: String!
    products: [DataLoaderProduct!]!
    rating: Float!
  }

  input SeedDatabaseInput {
    categoriesCount: Int!
    manufacturersPerCategory: Int!
    productsPerManufacturer: Int!
  }

  type Query {
    categories: [Category!]!
    categoriesDataLoaded: [DataLoaderCategory!]!
  }

  type Mutation {
    wipeDatabase: Boolean!
    seedDatabase(input: SeedDatabaseInput): Boolean!
  }
`;
