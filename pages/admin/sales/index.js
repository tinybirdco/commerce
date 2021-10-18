import SalesChart from './chart'
import Data from '@components/common/Data'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function Sales({ currentParams }) {
  const { range, ...rest } = currentParams

  if (range) {
    rest[range] = 1
  }

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
        parameters={[
          { name: 'category', type: 'string' },
          { name: 'color', type: 'string' },
          { name: 'devices', type: 'string' },
          { name: 'size', type: 'string' },
          { name: 'month', type: 'string' },
          { name: 'week', type: 'string' },
        ]}
        queryParameters={rest}
      >
        {(state) => (
          <SalesChart devices={rest.devices} range={range} {...state} />
        )}
      </Data>
    </>
  )
}
