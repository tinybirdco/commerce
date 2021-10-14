import useEffectOnUpdate from '@lib/hooks/useEffectOnUpdate'
import { ReactNode, useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const PIPES_PATHNAME = '/v0/pipes'
const DEFAULT_FORMAT = 'json'

export default function Data(props: {
  host?: string
  token: string
  pipe: string
  format?: string
  sql?: string
  parameters?: Array<{ name: string, type: string, defaultValue?: string }>
  queryParameters?: Object
  children: ReactNode | ReactNode[]
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const [meta, setMeta] = useState(null)

  async function _fetchData() {
    setLoading(true)
    setError(false)

    const dataURL = new URL(
      `${props.host || API_URL}${PIPES_PATHNAME}/${props.pipe}.${props.format || DEFAULT_FORMAT}`
    )

    let queryParams = new URLSearchParams(`token=${props.token}`)

    if (props.parameters) {
      props.parameters.forEach(({ name, type, defaultValue = '' }) => {
        queryParams.append(
          name,
          props.queryParameters && props.queryParameters[name] ? props.queryParameters[name] : defaultValue
        )
      })
    }

    if (props.sql) {
      queryParams.append('q', props.sql)
    }

    const res = await fetch(`${dataURL}?${queryParams.toString()}`)
      .then(response => response.json())
      .then(data => data)
      .catch(err => ({ error: err.toString() }))

    setLoading(false)
    setError(res.error)
    setData(res.data)
    setMeta(res.meta)
  }

  useEffectOnUpdate(() => {
    _fetchData()
  }, [props.parameters, props.queryParameters])

  useEffect(() => {
    _fetchData()
  }, [])

  return <>{props.children({ data, meta, loading, error })}</>
}
