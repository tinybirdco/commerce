import { SWRHook } from '@commerce/utils/types'
import useSearch, { UseSearch } from '@commerce/product/use-search'
import data from '../data_obj.json'

export default useSearch as UseSearch<typeof handler>

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN
const LIMIT = 20
export const handler: SWRHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher({ input, options }) {
    const url = `${API_URL}/v0/pipes/demo_purchase_prods_slow.json?token=${API_TOKEN}${
      input.brandId ? `&product=${input.brandId}` : ''
    }${input.categoryId ? `&section=${input.categoryId}` : ''}${
      input.sort ? `&ranking=${input.sort}` : ''
    }`
    const { res, error } = await fetch(url)
      .then((res) => res.json())
      .then((res) => ({ res }))
      .catch((error) => ({ error: error.toString() }))
    console.log(res)
    if (res?.data) {
      const { data: productIds } = res
      const products = productIds
        .map((product) => data[product.partnumber])
        .filter(Boolean)
        .slice(0, 100)

      return {
        products: products,
        found: true,
      }
    } else {
      console.log(error)
    }
  },
  useHook:
    ({ useData }) =>
    (input = {}) => {
      return useData({
        input: [
          ['categoryId', input.categoryId],
          ['brandId', input.brandId],
          ['sort', input.sort],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions,
        },
      })
    },
}
