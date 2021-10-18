import useEffectOnUpdate from '@lib/hooks/useEffectOnUpdate'
import { useState } from 'react'
import Data from '@components/common/Data'
import DevicesDonut from './donut'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export const DEVICES = {
  laptop: {
    color: '#F7A453',
  },
  tablet: {
    color: '#9D54F2',
  },
  mobile: {
    color: '#27ABA4',
  },
}

export default function Devices({ range, devices, category, size, color }) {
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
    <div className="mb-10 block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide">
      <h3 className={'block lg:block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'}>
        Devices (%)
      </h3>

      <div className="block lg:block px-4 py-0 lg:p-0 lg:my-0 lg:mx-4">
        <Data
          host={API_URL}
          token={API_TOKEN}
          pipe={'get_devices_usage'}
          parameters={parameters}
          queryParameters={queryParameters}
        >
          {(state) => <DevicesDonut devices={devices} {...state} />}
        </Data>
      </div>
    </div>
  )
}
