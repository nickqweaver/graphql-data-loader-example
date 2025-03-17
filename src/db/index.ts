import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";

// Set up the path for the local database file
// This will be stored in the root of the project
const dbPath = path.resolve(process.cwd(), "local.db");

// Initialize the libsql client
const client = createClient({
  url: `file:${dbPath}`,
});

// Initialize Drizzle ORM
export const db = drizzle(client, { schema, logger: true });
// Seed function for development
import { faker } from "@faker-js/faker";

type SeedConfig = {
  categoriesCount: number;
  manufacturersPerCategory: number;
  productsPerManufacturer: number;
};

export const seedDatabase = async (
  config: SeedConfig = {
    categoriesCount: 3,
    manufacturersPerCategory: 3,
    productsPerManufacturer: 3,
  },
) => {
  try {
    // Check if database is already seeded
    const categoryCount = await db.select().from(schema.categories).all();
    if (categoryCount.length === 0) {
      console.log("Seeding database...");

      // Generate categories
      const categories = Array.from(
        { length: config.categoriesCount },
        (_, i) => ({
          id: i + 1,
          name: faker.commerce.department(),
        }),
      );
      await db.insert(schema.categories).values(categories);

      // Generate manufacturers
      const manufacturers = [];
      let manufacturerId = 1;

      for (let i = 0; i < config.categoriesCount; i++) {
        for (let j = 0; j < config.manufacturersPerCategory; j++) {
          manufacturers.push({
            id: manufacturerId++,
            name: faker.company.name(),
            country: faker.location.country(),
            rating: Number(faker.number.float({ min: 3.0, max: 5.0 })),
          });
        }
      }
      await db.insert(schema.manufacturers).values(manufacturers);

      // Generate products
      const products = [];
      const stockInfo = [];
      let productId = 1;

      for (const category of categories) {
        const categoryManufacturers = manufacturers.slice(
          (category.id - 1) * config.manufacturersPerCategory,
          category.id * config.manufacturersPerCategory,
        );

        for (const manufacturer of categoryManufacturers) {
          for (let i = 0; i < config.productsPerManufacturer; i++) {
            // Add product
            products.push({
              id: productId,
              name: faker.commerce.productName(),
              price: Number(faker.commerce.price({ min: 100, max: 2000 })),
              categoryId: category.id,
              manufacturerId: manufacturer.id,
            });

            // Add corresponding stock info
            stockInfo.push({
              productId: productId,
              quantity: faker.number.int({ min: 0, max: 1000 }),
              location: `Warehouse ${faker.location.city()}`,
              lastUpdated: new Date().toISOString(),
            });

            productId++;
          }
        }
      }

      // Batch insert products and stock info
      const BATCH_SIZE = 500;
      for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const productBatch = products.slice(i, i + BATCH_SIZE);
        await db.insert(schema.products).values(productBatch);
      }

      for (let i = 0; i < stockInfo.length; i += BATCH_SIZE) {
        const stockBatch = stockInfo.slice(i, i + BATCH_SIZE);
        await db.insert(schema.stockInfo).values(stockBatch);
      }

      console.log("Database seeded successfully with:");
      console.log(`- ${categories.length} categories`);
      console.log(`- ${manufacturers.length} manufacturers`);
      console.log(`- ${products.length} products`);
      console.log(`- ${stockInfo.length} stock records`);
    } else {
      console.log("Database already seeded");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};
