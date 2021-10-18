import { useState, useRef, useEffect } from 'react'
import { group } from 'd3'
import * as echarts from 'echarts'
import { DEVICES } from '../devices'

export default function SalesChart({
  range,
  devices,
  meta,
  loading,
  data,
  error,
}) {
  const options = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '0%',
      right: '1%',
      bottom: '1%',
      containLabel: true,
    },
    yAxis: {
      type: 'value',
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        formatter: function (value) {
          return echarts.format.formatTime(
            !range || range === 'minutes' ? 'hh:mm' : 'yyyy-MM-dd',
            value
          )
        },
      },
    },
    series: [],
  }
  const [chart, setChart] = useState(null)
  const [source, setSource] = useState(null)
  const graphEl = useRef()
  const [windowWidth, setWindowWidth] = useState(undefined)

  function _createGraph() {
    setChart(echarts.init(graphEl.current))
  }

  function _renderGraph() {
    if (chart) {
      chart.setOption(options)
    }
  }

  function _updateSource() {
    if (chart) {
      const obj = {
        series: [],
        xAxis: {
          data: [],
        },
      }

      // Preventing endpoint error
      if (!data || error) {
        return
      }

      const groupedData = group(data, (d) => d['device'])
      const devicesKeys = Array.from(groupedData.keys())

      const groupedByTime = group(data, (d) => d['date'])
      const timeKeys = Array.from(groupedByTime.keys())

      obj['xAxis']['data'] = timeKeys

      obj['series'] = devicesKeys.map((device) => {
        const data = timeKeys.map((date) => {
          const row = groupedByTime.get(date).find((r) => r.device === device)
          if (row) {
            return row.total_sales
          } else {
            return null
          }
        })

        return {
          name: device,
          type: 'bar',
          stack: 'total',
          itemStyle: {
            color: DEVICES[device]?.color,
          },
          data,
        }
      })

      chart.setOption(obj)
    }
  }

  useEffect(
    function () {
      _updateSource()
    },
    [data, meta]
  )

  useEffect(
    function () {
      if (chart) {
        _updateSource()
      }
    },
    [source]
  )

  useEffect(
    function () {
      _renderGraph()
    },
    [chart]
  )

  useEffect(
    function () {
      if (chart) {
        chart.resize()
      }
    },
    [windowWidth]
  )

  useEffect(function () {
    function handleResize() {
      setWindowWidth(window.innerWidth - 14)
    }

    if (graphEl.current && !chart) {
      _createGraph()
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={'Chart'}
      style={{ height: '320px', width: '100%' }}
      ref={graphEl}
    ></div>
  )
}
