import type { APIRoute } from 'astro'
import { getEntry } from 'astro:content'
import Stripe from 'stripe'

export const prerender = false

export const GET: APIRoute = async ({ params, redirect, url }) => {
  const REQUEST_ORIGIN = url.origin
  const stripe = new Stripe(import.meta.env.STRIPE_API_KEY)
  const product = await getEntry('product', params.slug)

  if (!product) {
    return new Response('Product not found', { status: 404 })
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: 'price_1PuYk52H1YElEA83stpbLvOa', quantity: 1 }],
    mode: 'payment',
    success_url: `${REQUEST_ORIGIN}/products/success`,
    cancel_url: `${REQUEST_ORIGIN}/products/cancel`,
  })

  if (!session.url) {
    return new Response('Error creating session', { status: 500 })
  }

  return redirect(session.url, 303)
}
