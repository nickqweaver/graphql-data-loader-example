import { db, seedDatabase } from "../db";
import {
  products,
  categories,
  manufacturers,
  stockInfo,
  ProductsModel,
  CategoriesModel,
  StockInfoModel,
  ManufacturesModel,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { createDataLoaders } from "../data-loaders/index";

export type DataLoadersType = ReturnType<typeof createDataLoaders>;
type Context = {
  db: typeof db;
  dataloaders: DataLoadersType;
};

export const resolvers = {
  Query: {
    categories: async (_: any, _args: {}, ctx: Context) => {
      return ctx.db.select().from(categories).all();
    },
    categoriesDataLoaded: async (_: any, _args: {}, ctx: Context) => {
      return ctx.db.select().from(categories).all();
    },
  },
  Mutation: {
    wipeDatabase: async (_: any, _args: {}, ctx: Context) => {
      await ctx.db.transaction(async (tx) => {
        await tx.delete(stockInfo);
        await tx.delete(products);
        await tx.delete(manufacturers);
        await tx.delete(categories);
      });
      return true;
    },
    seedDatabase: async (
      _: any,
      args: {
        input: {
          categoriesCount: number;
          manufacturersPerCategory: number;
          productsPerManufacturer: number;
        };
      },
    ) => {
      try {
        await seedDatabase(args.input);
        return true;
      } catch (err) {
        return false;
      }
    },
  },
  DataLoaderCategory: {
    products: async (root: CategoriesModel, _args: {}, ctx: Context) => {
      return await ctx.dataloaders.get("categoryProductLoader").load(root.id);
    },
  },
  DataLoaderProduct: {
    category: async (root: ProductsModel, _args: {}, ctx: Context) => {
      return await ctx.dataloaders.get("categoryLoader").load(root.categoryId);
    },
    manufacturer: async (root: ProductsModel, _args: {}, ctx: Context) => {
      return await ctx.dataloaders
        .get("manufacturesLoader")
        .load(root.manufacturerId);
    },
    stock: async (root: ProductsModel, _args: {}, ctx: Context) =>
      await ctx.dataloaders.get("productStockInfoLoader").load(root.id),
  },
  DataLoaderStockInfo: {
    product: async (root: StockInfoModel, _args: {}, ctx: Context) =>
      await ctx.dataloaders.get("productLoader").load(root.productId),
  },
  DataLoaderManufacturer: {
    products: async (root: ManufacturesModel, _args: {}, ctx: Context) =>
      await ctx.dataloaders.get("manufacturesProductLoader").load(root.id),
  },
  Product: {
    category: async (parent: { categoryId: number }) => {
      return db
        .select()
        .from(categories)
        .where(eq(categories.id, parent.categoryId))
        .get();
    },
    manufacturer: async (parent: { manufacturerId: number }) => {
      return db
        .select()
        .from(manufacturers)
        .where(eq(manufacturers.id, parent.manufacturerId))
        .get();
    },
    stock: async (parent: { id: number }) => {
      return db
        .select()
        .from(stockInfo)
        .where(eq(stockInfo.productId, parent.id))
        .get();
    },
  },
  Category: {
    products: async (parent: { id: number }) => {
      return db
        .select()
        .from(products)
        .where(eq(products.categoryId, parent.id))
        .all();
    },
  },
  StockInfo: {
    product: async (parent: { productId: number }) => {
      return db
        .select()
        .from(products)
        .where(eq(products.id, parent.productId))
        .get();
    },
  },
  Manufacturer: {
    products: async (parent: { id: number }) => {
      return db
        .select()
        .from(products)
        .where(eq(products.manufacturerId, parent.id))
        .all();
    },
  },
};
