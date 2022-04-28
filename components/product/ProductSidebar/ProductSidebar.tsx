import s from './ProductSidebar.module.css'
import { FC, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { SelectedOptions } from '../helpers'
import Data from '@components/common/Data'
import { LoadingDots } from '@components/ui'

// const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
// const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

const API_STOCK_URL = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_API
const API_STOCK_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_TOKEN

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_2
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN_2


interface ProductSidebarProps {
  product: Product
  className?: string
}

const getStock = (selectedSize, stockPerSize) => {
  if (stockPerSize.data) {
    const stock = stockPerSize.data.find(
      (prod) => prod.product_size.toString() === selectedSize
    )

    if (stock) {
      if (stock.available_stock === 1) {
        return 'Last unit available'
      }

      return `${stock.available_stock} units available`
    }
  }

  return ''
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  return (
    <div className={className}>
      Details
      <div className="mt-6">
        <Data
          host={API_URL}
          token={API_TOKEN}
          pipe={'api_views_item'}
          parameters={[
            {
              name: 'item_id',
              type: 'string',
              defaultValue: product.id,
            },
          ]}
          refreshInterval={3000}
        >
          {(state) => (
            <p className="text-accent-5 text-sm">
              {state && state.data
                ? new Intl.NumberFormat('en-IN').format(state.data[0].views)
                : 0}{' '}
              views in the last 15 mins{' '}
              {state && state.loading && <LoadingDots />}
            </p>
          )}
        </Data>
      </div>
      <div className="mt-6">
        <Data
          host={API_URL}
          token={API_TOKEN}
          pipe={'api_sold_item'}
          parameters={[
            {
              name: 'item_id',
              type: 'string',
              defaultValue: product.id,
            },
          ]}
          refreshInterval={9000}
        >
          {(state) => (
            <p className="text-accent-5 text-sm">              
              Sold {state && state.data && !!state.data[0]
                ? new Intl.NumberFormat('en-IN').format(state.data[0].times_sold)
                : 0}{' '}
              times in the last 24h{' '}
              {state && state.loading && <LoadingDots />}
            </p>
          )}
        </Data>
      </div>
    </div>
  )
}

export default ProductSidebar
