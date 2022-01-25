import type { LocalConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {
    const url = `${API_URL}/v0/pipes/demo_product_details.json?token=${API_TOKEN}&partnumber=${
      variables!.slug
    }`

    const { res, error } = await fetch(url)
      .then((res) => res.json())
      .then((res) => ({ res }))
      .catch((error) => ({ error: error.toString() }))

    if (res?.data) {
      const { data } = res
      const product = data[0]
      product.price = { value: product.basic_price }
      product.id = product.partnumber

      return {
        product: product,
      }
    } else {
      console.log(error)
      return Promise.reject(error)
    }
  }

  return getProduct
}
