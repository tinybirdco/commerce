import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
import Data from '@components/common/Data'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

const API_STOCK_URL = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_API
const API_STOCK_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_PRODUCTION_TOKEN

const parameters = [
  { name: 'partnumber', type: 'string', defaultValue: '11198810100-I2021' },
]

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const addItem = useAddItem()
  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem({
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0].id),
      })
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <ProductOptions
        options={product.options}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.descriptionHtml || product.description}
      />
      <div className="flex flex-row justify-between items-center">
        <Rating value={4} />
        <div className="text-accent-6 pr-1 font-medium text-sm">36 reviews</div>
      </div>
      <div>
        {process.env.COMMERCE_CART_ENABLED && (
          <Button
            aria-label="Add to Cart"
            type="button"
            className={s.button}
            onClick={addToCart}
            loading={loading}
            disabled={variant?.availableForSale === false}
          >
            {variant?.availableForSale === false
              ? 'Not Available'
              : 'Add To Cart'}
          </Button>
        )}
      </div>
      <div className="mt-6">
        <Collapse title="Stock">
          <Data
            host={API_STOCK_URL}
            token={API_STOCK_TOKEN}
            pipe={'demo_stock_per_product'}
            parameters={parameters}
          >
            {(state) => (
              <div>
                {state && state.data
                  ? state.data.map((d) => (
                      <div key={d.product_size}>
                        {`Size: ${d.product_size}  Available units: ${d.available_stock}`}
                      </div>
                    ))
                  : 0}
              </div>
            )}
          </Data>
        </Collapse>
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
