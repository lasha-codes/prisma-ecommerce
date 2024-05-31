import { Button } from '@/components/ui/button'
import PageHeader from '../_components/PageHeader'
import Link from 'next/link'
import {
  TableHead,
  TableHeader,
  Table,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import db from '@/db/db'
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/formatter'

const AdminProductsPage = () => {
  return (
    <>
      <div className='flex justify-between items-center gap-4'>
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href='/admin/products/new'>Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  )
}

export default AdminProductsPage

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: 'asc' },
  })

  if (products.length === 0) return <p>No products found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          return (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailableForPurchase ? (
                  <>
                    <CheckCircle2 />
                    <span className='sr-only'>Available</span>
                  </>
                ) : (
                  <>
                    <span className='sr-only'>Unavailable</span>
                    <XCircle />
                  </>
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {formatCurrency(product.priceInCents / 100)}
              </TableCell>
              <TableCell>{formatCurrency(product._count.orders)}</TableCell>
              <TableCell>
                <MoreVertical />
                <span className='sr-only'>Actions</span>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
