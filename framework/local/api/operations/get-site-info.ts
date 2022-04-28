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
          id: 'tours',
          name: 'Tours',
          slug: 'tours',
          path: '/tours',
        },
        {
          id: 'nature',
          name: 'Nature',
          slug: 'nature',
          path: '/nature',
        },
        {
          id: 'cities',
          name: 'Cities',
          slug: 'cities',
          path: '/cities',
        },
        {
          id: 'beaches',
          name: 'Beaches',
          slug: 'beaches',
          path: '/beaches',
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
