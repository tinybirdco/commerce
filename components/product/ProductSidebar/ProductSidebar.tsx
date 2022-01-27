import s from './ProductSidebar.module.css'
import { FC, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { SelectedOptions } from '../helpers'
import Data from '@components/common/Data'
import { LoadingDots } from '@components/ui'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

const API_STOCK_URL = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_API
const API_STOCK_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_TOKEN

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
      <div className="mb-12">
        <Data
          host={API_STOCK_URL}
          token={API_STOCK_TOKEN}
          pipe={'demo_stock_per_product'}
          parameters={[
            { name: 'partnumber', type: 'string', defaultValue: product.id },
          ]}
        >
          {(stockPerSize) => (
            <div>
              {stockPerSize && stockPerSize.data ? (
                <ProductOptions
                  options={[
                    {
                      displayName: 'Size',
                      id: 'option-size',
                      values:
                        stockPerSize.data.length > 0
                          ? stockPerSize.data.map((d) => ({
                              label: d.product_size.toString(),
                              disabled: !d.available_stock,
                            }))
                          : [{ label: 'Sold out', disabled: true }],
                    },
                  ]}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                />
              ) : null}
              <p className="h-6">
                {getStock(selectedOptions.size, stockPerSize)}
              </p>
            </div>
          )}
        </Data>
      </div>
      <div className="mt-6">
        <Data
          host={API_URL}
          token={API_TOKEN}
          pipe={'demo_views_per_partnumber'}
          parameters={[
            {
              name: 'partnuπmber',
              type: 'string',
              defaultValue: product.id,
            },
          ]}
          refreshInterval={10000}
        >
          {(state) => (
            <p className="text-accent-5 text-sm">
              {state && state.data
                ? new Intl.NumberFormat('en-IN').format(state.data[0].views)
                : 0}{' '}
              views in the last 24h{' '}
              {state && state.loading && <LoadingDots />}
            </p>
          )}
        </Data>
      </div>
    </div>
  )
}

export default ProductSidebar
