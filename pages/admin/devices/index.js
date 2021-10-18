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

export default function Devices({ devices }) {
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
          parameters={[{ name: 'month', type: 'string', defaultValue: 1 }]}
          queryParameters={null}
        >
          {(state) => <DevicesDonut devices={devices} {...state} />}
        </Data>
      </div>
    </div>
  )
}
