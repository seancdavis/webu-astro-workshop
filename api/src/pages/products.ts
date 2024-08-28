import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ params, request }) => {
  const assetHost = new URL(request.url).origin
  const productCollection = await getCollection('product')
  const products = productCollection.map(({ slug, data }) => ({
    id: slug,
    data: {
      ...data,
      image: `${assetHost}/images/full/${data.image}`,
    },
  }))
  return new Response(JSON.stringify(products))
}
