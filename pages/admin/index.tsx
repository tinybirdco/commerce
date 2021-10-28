import type { SearchPropsType } from '@lib/search-props'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Layout } from '@components/common'
import { Container } from '@components/ui'

import Products from '../../components/admin/products'
import Filter from '../../components/admin/filter'
import Sort from '../../components/admin/sort'
import Dates from '../../components/admin/dates'
import Devices from '../../components/admin/devices'
import Metrics from '../../components/admin/metrics'
import Sales from '../../components/admin/sales'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function Admin({ categories, brands }: SearchPropsType) {
  const [activeFilter, setActiveFilter] = useState('')
  const [toggleFilter, setToggleFilter] = useState(false)

  const [filters, setFilters] = useState(null)

  const router = useRouter()
  const { sort, category, size, color, devices, range } = router.query

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
      const { d, e } = await fetch(`${API_URL}/v0/pipes/get_filters.json?token=${API_TOKEN}`)
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

  if (!router.isReady) {
    return null
  }

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 mb-20">
        <div className="col-span-8 lg:col-span-2 order-1 lg:order-none">
          <Filter
            filterName="category"
            filterPlural="All categories" 
            activeFilter={activeFilter} 
            currentFilter={category}
            currentParams={router.query}
            handleClick={handleClick} 
            items={filters?.categories}
            renderItem={null}
            toggleFilter={toggleFilter}
          />
          <Filter
            filterName="size"
            filterPlural="All sizes" 
            activeFilter={activeFilter} 
            currentFilter={size}
            currentParams={router.query}
            handleClick={handleClick} 
            items={filters?.sizes}
            renderItem={null}
            toggleFilter={toggleFilter}
          />
          <Filter
            filterName="color"
            filterPlural="All colors" 
            activeFilter={activeFilter} 
            currentFilter={color}
            currentParams={router.query}
            handleClick={handleClick} 
            items={filters?.colors}
            renderItem={null}
            toggleFilter={toggleFilter}
          />
        </div>
        
        <div className="col-span-8 order-3 lg:order-none">
          <Metrics {...router.query} />
          <Sales {...router.query} />
          <Products {...router.query} />
        </div>

        <div className="col-span-8 lg:col-span-2 order-2 lg:order-none">
          <Dates
            range={range}
            activeFilter={activeFilter} 
            currentParams={router.query}
            handleClick={handleClick} 
            toggleFilter={toggleFilter}
          />
          <Devices {...router.query} />
          <Sort
            sort={sort}
            activeFilter={activeFilter} 
            currentParams={router.query}
            handleClick={handleClick} 
            toggleFilter={toggleFilter}
          />
        </div>
      </div>
    </Container>
  )
}

Admin.Layout = Layout