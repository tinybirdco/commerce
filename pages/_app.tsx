import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import TinybirdProvider, { useTinybird } from 'next-tinybird'
import Data from '@components/common/Data'

const Noop: FC = ({ children }) => <>{children}</>

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN
const TRACKER_URL = process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_URL

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop
  const router = useRouter()
  const tinybird = useTinybird()
  
  useEffect(() => {
    tinybird('pageload', { url: router.pathname })

    const handleRouteChange = (url: string) => {
      tinybird('pageload', { url })
    }

    router.events.on('routeChangeStart', handleRouteChange)

    document.body.classList?.remove('loading')

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return (
    <TinybirdProvider 
      api={API_URL}
      trackerURL={TRACKER_URL}
      dataSource={'events'}
      token={API_TOKEN}
    >
      <Head />
      <Data 
        parameters={[{
          name: 'whatever',
          type: 'string',
          defaultValue: 'hello'
        }]} 
        queryParameters={{ whatever: 'world' }} 
        pipe="events_pipe" 
        host={API_URL}
        token={API_TOKEN}
      >
        {(props: { data: Array<any>, error: string, meta: Array<any>, loading: Boolean }) => {
          return <p>events rows: {props.loading ? 'true' : 'false'} {props.data && props.data.length}</p>
        }}
      </Data>
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </TinybirdProvider>
  )
}
