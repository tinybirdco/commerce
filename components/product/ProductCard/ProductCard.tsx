import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import type { Product } from '@commerce/types/product'
import s from './ProductCard.module.css'
import Image, { ImageProps } from 'next/image'
import WishlistButton from '@components/wishlist/WishlistButton'
import usePrice from '@framework/product/use-price'
import ProductTag from '../ProductTag'

interface Props {
  className?: string
  product: Product
  noNameTag?: boolean
  imgProps?: Omit<ImageProps, 'src' | 'layout' | 'placeholder' | 'blurDataURL'>
  variant?: 'default' | 'slim' | 'simple'
  sort?: string
}

const placeholderImg = '/product-img-placeholder.svg'
const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_2
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN_2

const ProductCard: FC<Props> = ({
  product,
  imgProps,
  className,
  noNameTag = false,
  variant = 'default',
  sort = 'sales',
}) => {
  const { price } = usePrice({
    amount: parseInt(product.price.value),
    baseAmount: product.price.retailPrice,
    currencyCode: 'USD',
  })

  const rootClassName = cn(
    s.root,
    { [s.slim]: variant === 'slim', [s.simple]: variant === 'simple' },
    className
  )

  const handleClick = async (event: any, filter: string) => {
    const date = new Date();
    const evento = {
      'timestamp': date.toISOString(),
      'article_id': product.partnumber
    }

    const headers = {
      'Authorization': `Bearer ${API_TOKEN}`
    }

    let url = `${API_URL}/v0/events?name=clicks`

    const rawResponse = await fetch(`${url}`, {
      method: 'POST',
      body: JSON.stringify(evento),
      headers: headers,
    });
  }

  return (
    <div onClick={(e) => handleClick(e, product.partnumber)}>
      <a className={rootClassName}>
        {variant === 'slim' && (
          <>
            <div className={s.header}>
              <span>{product.name}</span>
            </div>
            {product?.images && (
              <Image
                quality="85"
                src={product.images[0]?.url || placeholderImg}
                alt={product.name || 'Product Image'}
                height={320}
                width={320}
                layout="fixed"
                {...imgProps}
              />
            )}
          </>
        )}

        {variant === 'simple' && (
          <>
            {process.env.COMMERCE_WISHLIST_ENABLED && (
              <WishlistButton
                className={s.wishlistButton}
                productId={product.id}
                variant={product.variants[0]}
              />
            )}
            {!noNameTag && (
              <div className={s.header}>
                <h3 className={s.name}>
                  <span>{product.name}</span>
                </h3>
                <div className={s.price}>{`${price}`}</div>
              </div>
            )}
            {!noNameTag && (
              <div className={s.header} style={{
                right: '0px',
                left: 'auto',
                paddingRight: '0px'
              }}>
                <div className={s.price} style={{
                paddingRight: '0.2em',
                paddingLeft: '0.2em',
                paddingBottom: '0.2em',
                fontSize: '0.75em',
                left: 'auto'
              }}>
                {`${product.total}${(sort === 'sales')?'$':' clicks'}`}
                </div>
              </div>
            )}            
            <div className={s.imageContainer}>
              {product?.images && (
                <Image
                  alt={product.name || 'Product Image'}
                  className={s.productImage}
                  src={product.images[0]?.url || placeholderImg}
                  height={540}
                  width={540}
                  quality="85"
                  layout="responsive"
                  {...imgProps}
                />
              )}
            </div>
          </>
        )}

        {variant === 'default' && (
          <>
            {process.env.COMMERCE_WISHLIST_ENABLED && (
              <WishlistButton
                className={s.wishlistButton}
                productId={product.id}
                variant={product.variants[0] as any}
              />
            )}
            <ProductTag name={product.name} price={`${price}`} />
            <div className={s.imageContainer}>
              {product?.images && (
                <Image
                  alt={product.name || 'Product Image'}
                  className={s.productImage}
                  src={product.images[0]?.url || placeholderImg}
                  height={540}
                  width={540}
                  quality="85"
                  layout="responsive"
                  {...imgProps}
                />
              )}
            </div>
          </>
        )}
      </a>
    </div>
  )
}

export default ProductCard
