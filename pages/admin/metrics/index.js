import Data from '@components/common/Data'
import MetricsItem from './item'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN

export default function Metrics({ currentParams }) {
  const { range, ...rest } = currentParams

  if (range) {
    rest[range] = 1
  }

  return (
    <div className="col-span-8 order-3 lg:order-none">
      <div className="block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide">
        <h3 className={'block lg:inline-block my-4'}>Metrics</h3>
      </div>

      <div className="block">
        <Data
          host={API_URL}
          token={API_TOKEN}
          pipe={'get_totals'}
          parameters={[
            { name: 'category', type: 'string' },
            // { name: 'color', type: 'string' },
            { name: 'devices', type: 'string' },
            { name: 'size', type: 'string' },
            { name: 'month', type: 'string' },
            { name: 'week', type: 'string' },
          ]}
          queryParameters={rest}
        >
          {(state) => (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MetricsItem
                title="TOTAL SALES"
                value={state && state.data ? state.data[0].total_sales : 0}
                prevValue={
                  state && state.data ? state.data[0].previous_total_sales : 0
                }
                prefix={'$'}
              />
              <MetricsItem
                title="TOTAL ORDERS"
                value={state && state.data ? state.data[0].total_orders : 0}
                prevValue={
                  state && state.data ? state.data[0].previous_total_orders : 0
                }
              />
              <MetricsItem
                title="PROCESSED DATA"
                value={state && state.data ? state.data[0].processed_data : 0}
                prevValue={
                  state && state.data
                    ? state.data[0].previous_processed_data
                    : 0
                }
                formatter={(bytes) => {
                  const si = false
                  const dp = 1
                  const thresh = si ? 1000 : 1024

                  if (Math.abs(bytes) < thresh) {
                    return bytes + ' B'
                  }

                  const units = si
                    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
                    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
                  let u = -1
                  const r = 10 ** dp

                  do {
                    bytes /= thresh
                    ++u
                  } while (
                    Math.round(Math.abs(bytes) * r) / r >= thresh &&
                    u < units.length - 1
                  )

                  return bytes.toFixed(dp) + ' ' + units[u]
                }}
              />
            </div>
          )}
        </Data>
      </div>
    </div>
  )
}
