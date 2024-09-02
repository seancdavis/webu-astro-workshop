import type { CollectionEntry } from "astro:content";

export function productPath(product: CollectionEntry<"product">) {
  return `/products/${product.slug}`;
}

export function productBuyNowPath(product: CollectionEntry<"product">) {
  return `/api/products/${product.slug}/buy`;
}

export function productNewReviewPath(product: CollectionEntry<"product">) {
  return `/api/products/${product.slug}/review`;
}
