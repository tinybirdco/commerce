import type { SearchPropsType } from '@lib/search-props'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Layout } from '@components/common'
import { Container } from '@components/ui'

import Products from './products'
import Filter from './filter'
import Sort from './sort'
import Dates from './dates'
import SalesChart from './sales-chart'
import Data from '@components/common/Data'
import Devices from './devices'
import Metrics from './metrics'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function Admin({ categories, brands }: SearchPropsType) {
  const [activeFilter, setActiveFilter] = useState('')
  const [toggleFilter, setToggleFilter] = useState(false)

  const [filters, setFilters] = useState({})

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
            items={filters.categories}
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
            items={filters.sizes}
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
            items={filters.colors}
            renderItem={null}
            toggleFilter={toggleFilter}
          />
        </div>
        
        <div className="col-span-8 order-3 lg:order-none">
          <Metrics currentParams={router.query}/>

          <div className="block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide mt-20">
            <h3 className={'block lg:inline-block py-4 '}>
              Sales
            </h3>
          </div>

          <Data
            host={API_URL}
            token={API_TOKEN}
            pipe={'get_sales_period'}
            parameters={[{ name: 'month', type: 'string', defaultValue: 1 }]}
            queryParameters={null}
          >
            {state => <SalesChart range={range} {...state} />}
          </Data>

          <Products />
        </div>

        <div className="col-span-8 lg:col-span-2 order-2 lg:order-none">
          <Dates
            range={range}
            activeFilter={activeFilter} 
            currentParams={router.query}
            handleClick={handleClick} 
            toggleFilter={toggleFilter}
          />
          <Devices
            devices={devices}
            currentParams={router.query}
          />
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