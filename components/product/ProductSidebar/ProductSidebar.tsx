import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Text, Collapse, useUI } from '@components/ui'
import {
  SelectedOptions,
} from '../helpers'
import Data from '@components/common/Data'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

const API_STOCK_URL = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_API
const API_STOCK_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_TOKEN

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  return (
    <div className={className}>
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.descriptionHtml || product.description}
      />
      <div className="mt-6">
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
                      values: stockPerSize.data.map((d) => ({
                        label: d.product_size.toString(),
                        disabled: !d.available_stock,
                      })),
                    },
                  ]}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                />
              ) : (
                0
              )}
              <Collapse title="Stock">
                {stockPerSize && stockPerSize.data
                  ? stockPerSize.data.map((d) => (
                      <div key={d.product_size}>
                        {`Size: ${d.product_size}  Available units: ${d.available_stock}`}
                      </div>
                    ))
                  : 0}
              </Collapse>
            </div>
          )}
        </Data>
        <Collapse title="Views">
          <Data
            host={API_URL}
            token={API_TOKEN}
            pipe={'demo_views_per_partnumber'}
            parameters={[
              { name: 'partnumber', type: 'string', defaultValue: product.id },
            ]}
          >
            {(state) => (
              <div>
                {state && state.data ? state.data[0].views : 0} views in the
                last 24h
              </div>
            )}
          </Data>
        </Collapse>
      </div>
    </div>
  )
}

export default ProductSidebar
