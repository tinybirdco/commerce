import { ProductCard } from '@components/product'
import { Skeleton } from '@components/ui'
import rangeMap from '@lib/range-map'
import Data from '@components/common/Data'

import data from '../../framework/local/data.json'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function Products() {
  const products = data.products

  return (
    <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Data
        host={API_URL}
        token={API_TOKEN}
        pipe={'get_product_sales'}
        parameters={[{ name: 'month', type: 'string', defaultValue: 1 }]}
        queryParameters={null}
      >
        {(state) => {
          return !state.data
            ? rangeMap(12, (i) => (
                <Skeleton key={i}>
                  <div className="w-60 h-60" />
                </Skeleton>
              ))
            : state.data?.length > 0
            ? state.data.map((_p) => {
                const product = products.find((p) => p.id === _p.product_id)
                return (
                  <ProductCard
                    variant="simple"
                    key={product.path}
                    className="animated fadeIn"
                    product={{
                      ...product,
                      price: { value: _p.price, currencyCode: 'USD' },
                    }}
                    imgProps={{
                      width: 200,
                      height: 200,
                    }}
                  />
                )
              })
            : products.map((product) => (
                <ProductCard
                  variant="simple"
                  key={product.path}
                  className="animated fadeIn"
                  product={{
                    ...product,
                    price: { value: 0, currencyCode: 'USD' },
                  }}
                  imgProps={{
                    width: 480,
                    height: 480,
                  }}
                />
              ))
        }}
      </Data>
    </div>
  )
}
