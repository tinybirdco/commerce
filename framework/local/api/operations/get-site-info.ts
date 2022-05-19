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
          id: 'shoes',
          name: 'Shoes',
          slug: 'shoes',
          path: '/shoes',
        },
        {
          id: 'shirts',
          name: 'Shirts',
          slug: 'shirt',
          path: '/shirt',
        },
      ],
      brands: [
        {
          node: {
            entityId: 'africa',
            name: 'Africa',
            path: `brands/africa`,
          },
        },
        {
          node: {
            entityId: 'america',
            name: 'Americas',
            path: `brands/america`,
          },
        },
        {
          node: {
            entityId: 'asia',
            name: 'Asia',
            path: `brands/asia`,
          },
        },
        {
          node: {
            entityId: 'europe',
            name: 'Europe',
            path: `brands/europe`,
          },
        },
        {
          node: {
            entityId: 'safaris',
            name: 'Safaris',
            path: `brands/safaris`,
          },
        },
        
      ],
    })
  }

  return getSiteInfo
}
