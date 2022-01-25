import { OperationContext } from '@commerce/api/operations'
import { Category } from '@commerce/types/site'
import { LocalConfig } from '../index'

export type GetSiteInfoResult<
  T extends { categories: any[]; brands: any[] } = {
    categories: Category[]
    brands: any[]
  }
> = T

export default function getSiteInfoOperation({}: OperationContext<any>) {
  function getSiteInfo({
    query,
    variables,
    config: cfg,
  }: {
    query?: string
    variables?: any
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<GetSiteInfoResult> {
    return Promise.resolve({
      categories: [
        {
          id: 'women',
          name: 'Women',
          slug: 'women',
          path: '/women',
        },
        {
          id: 'men',
          name: 'Men',
          slug: 'men',
          path: '/men',
        },
      ],
      brands: [
        {
          node: {
            entityId: 'shirts',
            name: 'Shirts',
            path: `brands/shirts`,
          },
        },
        {
          node: {
            entityId: 'trousers',
            name: 'Trousers',
            path: `brands/trousers`,
          },
        },
        {
          node: {
            entityId: 'shoes',
            name: 'Shoes',
            path: `brands/shoes`,
          },
        },
      ],
    })
  }

  return getSiteInfo
}
