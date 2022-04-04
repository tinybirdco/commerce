import { SWRHook } from '@commerce/utils/types'
import useSearch, { UseSearch } from '@commerce/product/use-search'

export default useSearch as UseSearch<typeof handler>

// const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
// const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_2
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN_2

export const handler: SWRHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher({ input }) {
    const { brandId, categoryId, sort, limit } = input
    let url = `${API_URL}/v0/pipes/demo_ranking_products.json?token=${API_TOKEN}&limit_prods=${
      limit ? `${limit}` : '50'
    }`

    if (brandId) {
      url += `&product=${brandId}`
    }
    if (categoryId) {
      url += `&section=${categoryId}`
    }
    if (sort) {
      url += `&ranking=${sort}`
    }

    const { res, error } = await fetch(url)
      .then((res) => res.json())
      .then((res) => ({ res }))
      .catch((error) => ({ error: error.toString() }))

    if (res?.data) {
      const { data } = res
      const products = data.map((product) => ({
        ...product,
        price: { value: product.basic_price },
        slug: product.partnumber,
        images: [{ url: product.image }],
      }))

      return {
        products: products,
        found: true,
      }
    } else {
      console.log(error)
      return { products: [] }
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
          ['limit', input.limit],
          ['lastRefresh', input.lastRefresh],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions,
        },
      })
    },
}
