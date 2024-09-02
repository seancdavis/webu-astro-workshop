import type { CollectionEntry } from 'astro:content'

export function productImagePath(product: CollectionEntry<'product'>) {
  return `/.netlify/images?url=/images/${product.data.image}`
}
