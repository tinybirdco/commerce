const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation() {
  async function getAllProductPaths(): Promise<GetAllProductPathsResult> {
    const url = `${API_URL}/v0/pipes/basic_data.json?token=${API_TOKEN}`

    const { res, error } = await fetch(url)
      .then((res) => res.json())
      .then((res) => ({ res }))
      .catch((error) => ({ error: error.toString() }))

    if (res?.data) {
      const { data } = res
      const productPaths = data.map((product) => ({
        path: `/${product.path}`,
      }))

      return { products: productPaths }
    } else {
      console.log(error)
      return Promise.reject(error)
    }
  }

  return getAllProductPaths
}
