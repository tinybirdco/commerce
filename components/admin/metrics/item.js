import { useState } from 'react'
import CountUp from 'react-countup'

export default function MetricsItem({
  title,
  value,
  prevValue,
  suffix = '',
  prefix = '',
  formatter,
}) {
  const opts = {
    duration: 0.5,
    separator: ',',
    prefix,
    suffix,
    className: 'block text-2xl font-bold mt-1',
    preserveValue: true,
  }

  if (formatter) {
    opts['formattingFn'] = formatter
  }

  const [options] = useState(opts)
  const diffValue = value / prevValue - 1 || 0

  return (
    <div className="block">
      <h4 className="text-xs text-accent-6 font-medium">{title}</h4>
      <CountUp {...options} end={value} />
      <span
        className={`inline-block text-sm font-mono px-2 py-1 mt-2 rounded-sm ${
          diffValue >= 0 ? 'text-accent-4' : 'text-red'
        }`}
        style={{
          backgroundColor: diffValue >= 0 ? '#F6F7F9' : 'rgba(255, 0, 0, 0.1)',
        }}
      >
        {!!value
          ? `${diffValue > 0 ? '+' : ''}${(diffValue * 100).toFixed(0)}%`
          : 0}
      </span>
    </div>
  )
}
