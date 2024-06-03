import { Suspense } from 'react'
import { ProductSkeletonCard } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import db from '@/db/db'

const getProducts = () => {
  return db.product.findMany({ where: { isAvailableForPurchase: true } })
}

const ProductsPage = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <Suspense
        fallback={
          <>
            <ProductSkeletonCard />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
          </>
        }
      >
        <ProductsSuspense />
      </Suspense>
    </div>
  )
}

export default ProductsPage

async function ProductsSuspense() {
  const products = await getProducts()
  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ))
}
