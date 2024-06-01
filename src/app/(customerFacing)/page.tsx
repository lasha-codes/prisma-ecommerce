import db from '@/db/db'

function getMostPopularProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: {
      orders: {
        _count: 'desc',
      },
    },
    take: 6,
  })
}

function getNewestProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

const Homepage = () => {
  return <h1>Hi</h1>
}

export default Homepage
