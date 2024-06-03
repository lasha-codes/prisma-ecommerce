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
import { FormEvent, useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (stripe === null || elements === null) {
      return
    }

    setIsLoading(true)

    // Check for existing order

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase/success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown message occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <PaymentElement />
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className='text-destructive'>
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className='w-full'
            size='lg'
            disabled={stripe === null || elements === null || isLoading}
          >
            {isLoading
              ? 'Purchasing...'
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
