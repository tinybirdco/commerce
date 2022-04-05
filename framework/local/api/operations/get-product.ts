import type { LocalConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import data from '../../data.json'

// const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
// const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_2
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN_2

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
    let product = data.products.find(({ slug }) => slug === variables!.slug)
  
    if(!product) {
      const url = `${API_URL}/v0/pipes/property_details.json?token=${API_TOKEN}&property_id=${
        variables!.slug
      }`
      // console.log(url)
  
      const { res, error } = await fetch(url)
        .then((res) => res.json())
        .then((res) => ({ res }))
        .catch((error) => ({ error: error.toString() }))
  
      if (res?.data) {
        const { data } = res
        // console.log(data[0])
        product = data[0]
        product.name = product.title
        product.price = { value: product.ppm }
        product.id = product.id
        product.images = product.photos.map(e => ({ url: e }))

      } else {
        console.log(error)
        return Promise.reject(error)
      }
    }

    return {
      product: product,
    }
  }

  return getProduct
}
