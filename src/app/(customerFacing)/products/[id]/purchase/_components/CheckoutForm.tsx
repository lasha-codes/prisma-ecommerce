'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatter'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'

type CheckoutFormProps = {
  product: {
    imagePath: string
    name: string
    priceInCents: number
    description: string
  }
  clientSecret: string
  publicKey: string
}

const CheckoutForm = ({
  product,
  clientSecret,
  publicKey,
}: CheckoutFormProps) => {
  const stripePromise = loadStripe(publicKey)
  return (
    <div className='max-w-5xl w-full mx-auto space-y-8'>
      <div className='flex gap-4 items-center'>
        <div className='aspect-video flex-shrink-0 w-1/3 relative'>
          <Image
            src={'/' + product.imagePath}
            fill
            alt=''
            className='object-cover'
          />
        </div>
        <div>
          <div className='text-lg'>
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <div className='line-clamp-3 text-muted-foreground'>
            {product.description}
          </div>
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} />
      </Elements>
    </div>
  )
}

export default CheckoutForm

function Form({ priceInCents }: { priceInCents: number }) {
  const stripe = useStripe()
  const elements = useElements()
  return (
    <form className='flex flex-col gap-4'>
      <PaymentElement />
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className='text-destructive'>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className='w-full'
            size='lg'
            disabled={stripe === null || elements === null}
          >
            Purchase - {formatCurrency(priceInCents / 100)}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
