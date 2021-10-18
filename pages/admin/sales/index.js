import useEffectOnUpdate from '@lib/hooks/useEffectOnUpdate'
import { useState } from 'react'
import SalesChart from './chart'
import Data from '@components/common/Data'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function Sales({ range, devices, category, size, color }) {
  const [parameters] = useState([
    { name: 'category', type: 'string' },
    { name: 'color', type: 'string' },
    { name: 'devices', type: 'string' },
    { name: 'size', type: 'string' },
    { name: 'month', type: 'string' },
    { name: 'week', type: 'string' },
  ])
  const [queryParameters, setQueryParameters] = useState(genParams())

  function genParams() {
    let obj = {
      devices,
      category,
      size,
      color,
    }

    if (range) {
      obj[range] = 1
    }

    return obj
  }

  useEffectOnUpdate(() => {
    setQueryParameters(genParams())
  }, [devices, category, size, range, color])

  return (
    <>
      <div className="block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide mt-20">
        <h3 className={'block lg:inline-block py-4 '}>
          {`Last ${range} sales`}
        </h3>
      </div>

      <Data
        host={API_URL}
        token={API_TOKEN}
        pipe={'get_sales_period'}
        parameters={parameters}
        queryParameters={queryParameters}
      >
        {(state) => <SalesChart devices={devices} range={range} {...state} />}
      </Data>
    </>
  )
}
