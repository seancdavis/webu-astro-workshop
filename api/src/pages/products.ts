import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ params, request }) => {
  const productCollection = await getCollection('product')
  const products = productCollection.map(({ slug, data }) => ({ id: slug, ...data }))
  return new Response(JSON.stringify(products))
}
