import db from '@/db/db'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const PurchasePage = async ({ params: { id } }: { params: { id: string } }) => {
  const product = await db.product.findUnique({ where: { id } })
  if (!product) return notFound()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: 'USD',
    metadata: {
      productId: product.id,
    },
  })

  if (paymentIntent.client_secret === null) {
    throw Error('Stripe failed to create payment intent')
  }

  return <h1>Hi</h1>
}

export default PurchasePage
