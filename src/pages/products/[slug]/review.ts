import { supabase } from '@/db/supabase'
import { productPath } from '@/utils/routes'
import type { APIRoute } from 'astro'
import { getEntry } from 'astro:content'

export const prerender = false

export const POST: APIRoute = async ({ params, redirect, url, request }) => {
  // const REQUEST_ORIGIN = url.origin
  // const stripe = new Stripe(import.meta.env.STRIPE_API_KEY)
  const product = await getEntry('product', params.slug)

  if (!product) {
    return new Response('Product not found', { status: 404 })
  }

  // Get form data
  const formData = await request.formData()
  const rating = formData.get('rating') as string
  const comment = formData.get('comment') as string

  if (!rating) {
    return new Response('Rating is required', { status: 400 })
  }

  // Save review to Supabase
  const { error } = await supabase.from('reviews').insert({
    product_id: product.id,
    rating: parseInt(rating, 10),
    comment,
  })

  if (error) {
    console.error('Error saving review:', error)
    return new Response('Error saving review', { status: 500 })
  }

  return redirect(productPath(product), 303)
}
