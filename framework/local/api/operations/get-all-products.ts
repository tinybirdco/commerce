import { Product } from '@commerce/types/product'
import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import type { LocalConfig, Provider } from '../index'
import data from '../../data.json'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN
const PIPES_PATHNAME = '/v0/pipes'
const DEFAULT_FORMAT = 'json'

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
    const pipe = 'get_product_ranking'
    const dataURL = new URL(`${API_URL}${PIPES_PATHNAME}/${pipe}.${DEFAULT_FORMAT}`)
    const queryParams = new URLSearchParams(`token=${API_TOKEN}`)

    const res = await fetch(`${dataURL}?${queryParams.toString()}`)
      .then(response => response.json())
      .then(data => data)
      .catch(err => ({ error: err.toString() }))
    
    const defaultRanking = data.products.length - res.data.length

    const productsRanking = data.products.map((product) => {
      const index = res.data.findIndex((productRanking => productRanking.slug === product.slug))

      return {
        ...product,
        ranking: index >= 0 ? index + 1 : defaultRanking
      }
    })

    const sortedProducts = productsRanking.sort((a, b) => {
      return a.ranking - b.ranking
    })

    return {
      products: sortedProducts
    }
  }
  return getAllProducts
}
