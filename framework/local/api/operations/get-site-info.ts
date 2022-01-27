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
          id: 'mujer',
          name: 'Mujer',
          slug: 'mujer',
          path: '/mujer',
        },
        {
          id: 'hombre',
          name: 'Hombre',
          slug: 'hombre',
          path: '/hombre',
        },
      ],
      brands: [
        {
          node: {
            entityId: 'abrigos',
            name: 'Abrigos',
            path: `brands/abrigos`,
          },
        },
        {
          node: {
            entityId: 'blazers',
            name: 'Blazers',
            path: `brands/blazers`,
          },
        },
        {
          node: {
            entityId: 'camisas',
            name: 'Camisas',
            path: `brands/camisas`,
          },
        },
        {
          node: {
            entityId: 'camisetas',
            name: 'Camisetas',
            path: `brands/camisetas`,
          },
        },
        {
          node: {
            entityId: 'sudaderas',
            name: 'Sudaderas',
            path: `brands/sudaderas`,
          },
        },
        {
          node: {
            entityId: 'pantalones',
            name: 'Pantalones',
            path: `brands/pantalones`,
          },
        },
        {
          node: {
            entityId: 'zapatos',
            name: 'Zapatos',
            path: `brands/zapatos`,
          },
        },
      ],
    })
  }

  return getSiteInfo
}
