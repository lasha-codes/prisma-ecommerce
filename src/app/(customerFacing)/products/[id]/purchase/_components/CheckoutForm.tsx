'use client'

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

type CheckoutFormProps = {
  product: {}
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
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <Form />
    </Elements>
  )
}

export default CheckoutForm

function Form() {
  const stripe = useStripe()
  const elements = useElements()
  return <PaymentElement />
}
