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
    className: 'block text-2xl font-bold',
    preserveValue: true,
    end: value,
  }

  if (formatter) {
    opts['formattingFn'] = formatter
  }

  const diffValue = value / prevValue - 1

  return (
    <div className="block">
      <h4 className="text-xs font-medium">{title}</h4>
      <CountUp {...opts} />
      <span>
        {!!value
          ? `${diffValue > 0 ? '+' : ''}${(diffValue * 100).toFixed(0)}%`
          : 0}
      </span>
    </div>
  )
}
