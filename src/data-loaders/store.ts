import DataLoader from "dataloader";
import {
  batchManufactures,
  batchManyCategoriesById,
  batchManyProductsByCategoryId,
  batchManyProductsByManufactureId,
  batchProductsById,
  batchStockInfoByProductId,
} from "./batching";

export const store = {
  categoryLoader: () => new DataLoader(batchManyCategoriesById),
  categoryProductLoader: () => new DataLoader(batchManyProductsByCategoryId),
  manufacturesLoader: () => new DataLoader(batchManufactures),
  manufacturesProductLoader: () =>
    new DataLoader(batchManyProductsByManufactureId),
  productLoader: () => new DataLoader(batchProductsById),
  productStockInfoLoader: () => new DataLoader(batchStockInfoByProductId),
};
