import type { CollectionEntry } from 'astro:content'

export function productPath(product: CollectionEntry<'product'>) {
  return `/products/${product.slug}`
}
