import cn from 'classnames'
import type { SearchPropsType } from '@lib/search-props'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Container, Skeleton } from '@components/ui'

import rangeMap from '@lib/range-map'
import useEffectOnUpdate from '@lib/hooks/useEffectOnUpdate'

const SORT = {
  'trending-desc': 'Trending',
  'latest-desc': 'Latest arrivals',
  'price-asc': 'Price: Low to high',
  'price-desc': 'Price: High to low',
}

function Filter ({ renderItem, items, handleClick, filterName, currentFilter, filterPlural, activeFilter, toggleFilter }) {
  return (
    <div className="relative inline-block w-full">
      <div className="lg:hidden">
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            onClick={(e) => handleClick(e, filterName)}
            className="flex justify-between w-full rounded-sm border border-accent-3 px-4 py-3 bg-accent-0 text-sm leading-5 font-medium text-accent-4 hover:text-accent-5 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-accent-1 active:text-accent-8 transition ease-in-out duration-150"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            {currentFilter || filterPlural}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      <div
        className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
          activeFilter !== 'categories' || toggleFilter !== true
            ? 'hidden'
            : ''
        }`}
      >
        <div className="rounded-sm bg-accent-0 shadow-xs lg:bg-none lg:shadow-none">
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <ul>
              <li className="block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8">
                <a
                    className={
                      'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                    }
                  >
                    {filterName[0].toUpperCase() + filterName.slice(1)}
                </a>
              </li>
            {/* {items? () : ()} */}
            </ul>

            {/* <ul>
              <li
                className={cn(
                  'block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                  {
                    underline: !activeCategory?.name,
                  }
                )}
              >
                <Link
                  href={{ pathname: getCategoryPath('', brand), query }}
                >
                  <a
                    onClick={(e) => handleClick(e, 'categories')}
                    className={
                      'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                    }
                  >
                    All Categories
                  </a>
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li
                  key={cat.path}
                  className={cn(
                    'block text-sm leading-5 text-accent-4 hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                    {
                      underline: activeCategory?.id === cat.id,
                    }
                  )}
                >
                  <Link
                    href={{
                      pathname: getCategoryPath(cat.path, brand),
                      query,
                    }}
                  >
                    <a
                      onClick={(e) => handleClick(e, 'categories')}
                      className={
                        'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                      }
                    >
                      {cat.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Admin({ categories, brands }: SearchPropsType) {
  const [activeFilter, setActiveFilter] = useState('')
  const [toggleFilter, setToggleFilter] = useState(false)

  const [filters, setFilters] = useState({})

  const router = useRouter()
  const { asPath, locale } = router
  const { sort, category, size, color, devices, range } = router.query

  console.log(sort, category, size, color, devices, range)

  const data = null

  // const { data } = useSearch({
  //   search: typeof q === 'string' ? q : '',
  //   categoryId: activeCategory?.id,
  //   brandId: (activeBrand as any)?.entityId,
  //   sort: typeof sort === 'string' ? sort : '',
  //   locale,
  // })

  const handleClick = (event: any, filter: string) => {
    if (filter !== activeFilter) {
      setToggleFilter(true)
    } else {
      setToggleFilter(!toggleFilter)
    }
    setActiveFilter(filter)
  }

  useEffect(function () {
    async function fetchFilters() {
      const { d, e } = await fetch('https://api.tinybird.co/v0/pipes/get_filters.json?token=p.eyJ1IjogIjA5MTU3Y2VhLTA1MTUtNGM4MS1hZjAzLTMwNTU5NjBiNzFiOCIsICJpZCI6ICI4OWJiYmNiOS1iMTgxLTQyZjUtOWFkYS1kNjA2YWRkODdlMGEifQ.nDoRE1TJOSIsF5yktcBgQv0wMTw85yH0lopv8RgWBPE')
      .then(r => r.json())
      .then(d => ({ d }))
      .catch(e => ({ e: e.toString() }))

      if (d?.data?.[0]) {
        setFilters(d.data[0])
      } else {
        console.log(e)
      }
    }
    
    fetchFilters()
  }, [])

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 mb-20">
        <div className="col-span-8 lg:col-span-2 order-1 lg:order-none">
          {/* Categories */}
          <Filter
            filterName="category"
            filterPlural="All categories" 
            activeFilter={activeFilter} 
            currentFilter={category} 
            handleClick={handleClick} 
            items={filters.categories}
            renderItem={null}
            toggleFilter={toggleFilter}
          />

          {/* Size */}
          <Filter
            filterName="size"
            filterPlural="All sizes" 
            activeFilter={activeFilter} 
            currentFilter={size} 
            handleClick={handleClick} 
            items={filters.sizes}
            renderItem={null}
            toggleFilter={toggleFilter}
          />

          {/* Color */}
          <Filter
            filterName="color"
            filterPlural="All colors" 
            activeFilter={activeFilter} 
            currentFilter={size} 
            handleClick={handleClick} 
            items={filters.colors}
            renderItem={null}
            toggleFilter={toggleFilter}
          />
        </div>
        {/* Products */}
        <div className="col-span-8 order-3 lg:order-none">
          {data ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((product: Product) => (
                <ProductCard
                  variant="simple"
                  key={product.path}
                  className="animated fadeIn"
                  product={product}
                  imgProps={{
                    width: 480,
                    height: 480,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rangeMap(12, (i) => (
                <Skeleton key={i}>
                  <div className="w-60 h-60" />
                </Skeleton>
              ))}
            </div>
          )}{' '}
        </div>

        {/* Sort */}
        <div className="col-span-8 lg:col-span-2 order-2 lg:order-none">
          <div className="relative inline-block w-full">
            <div className="lg:hidden">
              <span className="rounded-md shadow-sm">
                {/* <button
                  type="button"
                  onClick={(e) => handleClick(e, 'sort')}
                  className="flex justify-between w-full rounded-sm border border-accent-3 px-4 py-3 bg-accent-0 text-sm leading-5 font-medium text-accent-4 hover:text-accent-5 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-accent-1 active:text-accent-8 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {sort ? SORT[sort as keyof typeof SORT] : 'Relevance'}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button> */}
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== 'sort' || toggleFilter !== true ? 'hidden' : ''
              }`}
            >
              <div className="rounded-sm bg-accent-0 shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {/* <ul>
                    <li
                      className={cn(
                        'block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                        {
                          underline: !sort,
                        }
                      )}
                    >
                      <Link href={{ pathname, query: filterQuery({ q }) }}>
                        <a
                          onClick={(e) => handleClick(e, 'sort')}
                          className={
                            'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                          }
                        >
                          Relevance
                        </a>
                      </Link>
                    </li>
                    {Object.entries(SORT).map(([key, text]) => (
                      <li
                        key={key}
                        className={cn(
                          'block text-sm leading-5 text-accent-4 hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                          {
                            underline: sort === key,
                          }
                        )}
                      >
                        <Link
                          href={{
                            pathname,
                            query: filterQuery({ q, sort: key }),
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, 'sort')}
                            className={
                              'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                            }
                          >
                            {text}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

Admin.Layout = Layout