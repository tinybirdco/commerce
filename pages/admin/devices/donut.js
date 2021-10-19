import { useState, useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import { DEVICES } from '.'
import { useRouter } from 'next/router'

export default function DevicesDonut({ devices, meta, loading, data, error }) {
  const router = useRouter()
  const devicesArray = devices ? devices.split(',') : []

  const options = {
    tooltip: {},
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    legend: {
      icon: 'pin',
      orient: 'vertical',
      left: '0',
      bottom: '0',
      selected: _legendSelection(),
    },
    series: [
      {
        name: 'Devices',
        type: 'pie',
        radius: ['30%', '70%'],
        width: '100px',
        height: '100px',
        top: '0',
        left: '0',
        avoidLabelOverlap: false,
        label: {
          show: false,
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

  function _legendSelection() {
    let obj = {}

    Object.keys(DEVICES).forEach(function (d) {
      obj[d] = !devices || devicesArray.includes(d)
    })

    return obj
  }

  function _changeRoute(devices) {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    router.push(
      {
        pathname: `/admin`,
        query: {
          ...params,
          devices,
        },
      },
      null,
      { scroll: false }
    )
  }

  function _createGraph() {
    const echartInstance = echarts.init(graphEl.current)
    setChart(echartInstance)

    echartInstance.on('legendselectchanged', function ({ selected }) {
      _changeRoute(
        Object.keys(selected)
          .map((dev) => (selected[dev] ? dev : null))
          .filter((d) => !!d)
          .join(',')
      )
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
          data: Object.keys(DEVICES).map((d) => {
            const found = data && data.find((v) => v.device === d)

            if (found) {
              return {
                value: parseFloat(found.percentage).toFixed(2),
                name: d,
              }
            } else {
              return {
                value: 0,
                name: d,
              }
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
      style={{ height: '180px', width: '100%' }}
      ref={graphEl}
    ></div>
  )
}
