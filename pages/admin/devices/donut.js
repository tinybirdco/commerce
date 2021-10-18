import { useState, useRef, useEffect } from 'react'
import { group } from 'd3'
import * as echarts from 'echarts'
import { DEVICES } from '.'
import { useRouter } from 'next/router'
// import { DEVICES } from './devices'

export default function DevicesDonut({ devices, meta, loading, data, error }) {
  const router = useRouter()
  const { query } = router

  const options = {
    tooltip: {},
    grid: {
      top: '0%',
      bottom: 0,
      left: 0,
      right: 0,
    },
    legend: {
      orient: 'vertical',
      bottom: '0%',
    },
    series: [
      {
        name: 'Devices',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: [],
        itemStyle: {
          color: function ({ data: { name } }) {
            return DEVICES[name]?.color
          },
        },
      },
    ],
  }
  const [chart, setChart] = useState(null)
  const [source, setSource] = useState(null)
  const graphEl = useRef()
  const [windowWidth, setWindowWidth] = useState(undefined)

  function _createGraph() {
    const echartInstance = echarts.init(graphEl.current)
    setChart(echartInstance)

    echartInstance.on('legendselectchanged', function ({ name, selected }) {
      router.push({
        pathname: `/admin`,
        query: {
          ...query,
          devices: Object.keys(selected)
            .map((dev) => (selected[dev] ? dev : null))
            .filter((d) => !!d)
            .join(','),
        },
      })
    })
  }

  function _renderGraph() {
    if (chart) {
      chart.setOption(options)
    }
  }

  function _updateSource() {
    if (chart) {
      chart.setOption({
        series: {
          data: data.map((d) => {
            return {
              value: parseFloat(d.percentage).toFixed(2),
              name: d.device,
            }
          }),
        },
      })
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
      style={{ height: '177px', width: '80px' }}
      ref={graphEl}
    ></div>
  )
}
