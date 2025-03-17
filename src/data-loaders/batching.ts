import { db } from "../db/index";
import { orderOneToMany, orderOneToOne } from "./utils";

export async function batchManyProductsByCategoryId(ids: readonly number[]) {
  const query = await db.query.products.findMany({
    where: (product, { inArray }) =>
      inArray(product.categoryId, ids as number[]),
  });

  return orderOneToMany(ids, query, "categoryId");
}

export async function batchManyCategoriesById(ids: readonly number[]) {
  const query = await db.query.categories.findMany({
    where: (category, { inArray }) => inArray(category.id, ids as number[]),
  });

  return orderOneToMany(ids, query);
}

export async function batchManufactures(ids: readonly number[]) {
  const query = await db.query.manufacturers.findMany({
    where: (manufacture, { inArray }) =>
      inArray(manufacture.id, ids as number[]),
  });

  return orderOneToOne(ids, query);
}

export async function batchStockInfoByProductId(ids: readonly number[]) {
  const query = await db.query.stockInfo.findMany({
    where: (stockInfo, { inArray }) =>
      inArray(stockInfo.productId, ids as number[]),
  });

  return orderOneToOne(ids, query, "productId");
}

export async function batchProductsById(ids: readonly number[]) {
  const query = await db.query.products.findMany({
    where: (product, { inArray }) => inArray(product.id, ids as number[]),
  });

  return orderOneToOne(ids, query);
}

export async function batchManyProductsByManufactureId(ids: readonly number[]) {
  const query = await db.query.products.findMany({
    where: (product, { inArray }) =>
      inArray(product.manufacturerId, ids as number[]),
  });

  return orderOneToMany(ids, query, "manufacturerId");
}
