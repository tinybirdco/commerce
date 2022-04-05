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
          id: 'barcelona',
          name: 'Barcelona',
          slug: 'barcelona',
          path: '/barcelona',
        },
        {
          id: 'granada',
          name: 'Granada',
          slug: 'granada',
          path: '/granada',
        },
        {
          id: 'madrid',
          name: 'Madrid',
          slug: 'madrid',
          path: '/madrid',
        },
      ],
      brands: [
        {
          node: {
            entityId: 'apartment',
            name: 'Apartment',
            path: `brands/apartment`,
          },
        },
        {
          node: {
            entityId: 'studio',
            name: 'Studio',
            path: `brands/studio`,
          },
        },
        
      ],
    })
  }

  return getSiteInfo
}
