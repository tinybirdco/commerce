import { Product } from '@commerce/types/product'
import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import type { LocalConfig, Provider } from '../index'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    const url = `${API_URL}/v0/pipes/basic_data.json?token=${API_TOKEN}`

    const { res, error } = await fetch(url)
      .then((res) => res.json())
      .then((res) => ({ res }))
      .catch((error) => ({ error: error.toString() }))

    if (res?.data) {
      const { data } = res
      const products = data.map((product) => ({
        ...product,
        path: `/${product.path}`,
      }))

      return {
        products: variables?.first
          ? products.slice(0, variables?.first)
          : products,
      }
    } else {
      console.log(error)
      return Promise.reject(error)
    }
  }
  return getAllProducts
}
