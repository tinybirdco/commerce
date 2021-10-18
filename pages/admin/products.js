import useEffectOnUpdate from '@lib/hooks/useEffectOnUpdate'
import { useState } from 'react'
import { ProductCard } from '@components/product'
import { Skeleton } from '@components/ui'
import rangeMap from '@lib/range-map'
import Data from '@components/common/Data'

import data from '../../framework/local/data.json'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function Products({
  range,
  sort,
  devices,
  category,
  size,
  color,
}) {
  const products = data.products

  const [parameters] = useState([
    { name: 'category', type: 'string' },
    { name: 'color', type: 'string' },
    { name: 'devices', type: 'string' },
    { name: 'size', type: 'string' },
    { name: 'month', type: 'string' },
    { name: 'week', type: 'string' },
    { name: 'price_asc', type: 'string' },
    { name: 'price_desc', type: 'string' },
    { name: 'sales_asc', type: 'string' },
    { name: 'sales_desc', type: 'string' },
  ])
  const [queryParameters, setQueryParameters] = useState(genParams())

  function genParams() {
    let obj = {
      devices,
      category,
      size,
      color,
    }

    if (range) {
      obj[range] = 1
    }

    if (sort) {
      obj[sort] = 1
    } else {
      obj['price_desc'] = 1
    }

    return obj
  }

  useEffectOnUpdate(() => {
    setQueryParameters(genParams())
  }, [devices, category, size, range, sort, color])

  return (
    <div className="mt-20">
      <Data
        host={API_URL}
        token={API_TOKEN}
        pipe={'get_product_sales'}
        parameters={parameters}
        queryParameters={queryParameters}
      >
        {(state) => {
          return (
            <>
              <div className="block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:tracking-wide mt-20">
                <h3 className={'block lg:inline-block py-4'}>
                  {state.loading
                    ? 'Loading...'
                    : !!state.data
                    ? `Showing ${state.data.length} results`
                    : 'Loading...'}
                </h3>
              </div>
              <div className="block grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {!state.data
                  ? rangeMap(12, (i) => (
                      <Skeleton key={i}>
                        <div className="w-60 h-60" />
                      </Skeleton>
                    ))
                  : state.data?.length > 0
                  ? state.data.map((_p) => {
                      const product = products.find(
                        (p) => p.id === _p.product_id
                      )
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
                    ))}
              </div>
            </>
          )
        }}
      </Data>
    </div>
  )
}
