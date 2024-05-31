'use server'

import { z } from 'zod'
import db from '@/db/db'
import fs from 'fs/promises'
import { redirect } from 'next/navigation'

const fileSchema = z.instanceof(File, { message: 'required' })

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, 'Required'),
  image: fileSchema.refine((file) => file.size > 0, 'Required'),
})

export const addProduct = async (formData: FormData) => {
  const products = await db.product.findMany()
  console.log(products)
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return console.log(result.error.formErrors.fieldErrors)
  }

  const data = result.data

  await fs.mkdir('products', { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir('public/products', { recursive: true })
  const imagePath = `products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public/${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  )

  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: Number(data.priceInCents),
      filePath,
      imagePath,
    },
  })

  redirect('/admin/products')
}
