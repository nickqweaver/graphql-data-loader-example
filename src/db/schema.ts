import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const manufacturers = sqliteTable("manufacturers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  country: text("country").notNull(),
  rating: real("rating").notNull(),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  manufacturerId: integer("manufacturer_id")
    .notNull()
    .references(() => manufacturers.id),
});

export const stockInfo = sqliteTable("stock_info", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id)
    .unique(),
  quantity: integer("quantity").notNull(),
  location: text("location").notNull(),
  lastUpdated: text("last_updated").notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  manufacturer: one(manufacturers, {
    fields: [products.manufacturerId],
    references: [manufacturers.id],
  }),
  stock: one(stockInfo, {
    fields: [products.id],
    references: [stockInfo.productId],
  }),
}));

export const stockInfoRelations = relations(stockInfo, ({ one }) => ({
  product: one(products, {
    fields: [stockInfo.productId],
    references: [products.id],
  }),
}));

export type ProductsModel = typeof products.$inferSelect;
export type CategoriesModel = typeof categories.$inferSelect;
export type StockInfoModel = typeof stockInfo.$inferSelect;
export type ManufacturesModel = typeof manufacturers.$inferSelect;
