import cn from 'classnames'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import s from './ProductView.module.css'
import { FC } from 'react'
import type { Product } from '@commerce/types/product'
import usePrice from '@framework/product/use-price'
import { WishlistButton } from '@components/wishlist'
import { ProductSlider, ProductCard } from '@components/product'
import { Container, Text } from '@components/ui'
import ProductSidebar from '../ProductSidebar'
import ProductTag from '../ProductTag'
import Data from '@components/common/Data'

interface ProductViewProps {
  product: Product
  relatedProducts: Product[]
}

const IMAGES_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_2
const IMAGES_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN_2




const ProductView: FC<ProductViewProps> = ({ product, relatedProducts }) => {
  const getSortedImages = (data) => {
    const defaultRanking = product.images.length - data.length
  
    return product.images
      .map((image) => {
        const index = data.findIndex((rankingImage) => rankingImage.url === image.url)
  
        return {
          ...image,
          ranking: index >= 0 ? index + 1 : defaultRanking
        }
      })
      .sort((a, b) => a.ranking - b.ranking)
  }
  const { price } = usePrice({
    amount: product.price.value,
    baseAmount: product.price.retailPrice,
    currencyCode: 'USD',
  })

  return (
    <>
      <Container className="max-w-none w-full" clean>
        <div className={cn(s.root, 'fit')}>
          <div className={cn(s.main, 'fit')}>
            <ProductTag name={product.name} price={`${price}`} fontSize={32} />
            <div className={s.sliderContainer}>
              <Data
                host={IMAGES_URL}
                token={IMAGES_TOKEN}
                pipe={'most_clicked_image'}
                parameters={[
                  {
                    name: 'partnumber',
                    type: 'string',
                    defaultValue: product.id,
                  },
                ]}
              >
                {(props: { data: Array<any>, error: string, meta: Array<any>, loading: Boolean }) => {
                  const sortedImages = props && props.data
                    ? getSortedImages(props.data)
                    : product.images 

                  return <ProductSlider key={product.id}>
                    {sortedImages.map((image, i) => (
                      <div key={image.url}
                        className={s.imageContainer}
                        data-image={image.url}
                        data-product={product.id}>
                        <Image
                          className={s.img}
                          src={image.url}
                          alt={image.alt || 'Product Image'}
                          width={600}
                          height={600}
                          priority={i === 0}
                          quality="85"
                        />
                      </div>
                    ))}
                  </ProductSlider>
                }}
              </Data>
            </div>
            {process.env.COMMERCE_WISHLIST_ENABLED && (
              <WishlistButton
                className={s.wishlistButton}
                productId={product.id}
                variant={product.variants[0]}
              />
            )}
          </div>

          <ProductSidebar
            key={product.id}
            product={product}
            className={s.sidebar}
          />
        </div>
      </Container>
      <NextSeo
        title={product.name}
        description={product.description}
        openGraph={{
          type: 'website',
          title: product.name,
          description: product.description,
          images: [
            {
              url: product.images[0]?.url!,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
      />
    </>
  )
}

export default ProductView
