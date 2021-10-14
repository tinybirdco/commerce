import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import TinybirdProvider, { useTinybird } from 'next-tinybird'
import { useRouter } from 'next/router'
import Data from '@components/common/Data'

const Noop: FC = ({ children }) => <>{children}</>

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
    <TinybirdProvider api="https://api.tinybird.co" trackerURL={'https://storage.googleapis.com/tinybird-demo/tinybird-tracker.js'} dataSource={'events'} token={'p.eyJ1IjogIjE3YjNkMDUzLTNkMjUtNDczNS1hNGUzLTczOTg5YTkyM2M2OCIsICJpZCI6ICIwYWEyOGViNS0zYWJkLTQxNTEtODQyYS1iZGMwMzAzYzcwMjUifQ.dsgIM37qEy-VaMsScud9rNvG_aIQkiA85ZhB8kEHNIk'}>
      <Head />
      <Data pipe="events_pipe" token="p.eyJ1IjogIjE3YjNkMDUzLTNkMjUtNDczNS1hNGUzLTczOTg5YTkyM2M2OCIsICJpZCI6ICIzMDRmMzlmYy02Y2RjLTRmNGItYmYzMS0wYTdmOTE0ZGE5NTgifQ.gvQiUmQ0sO8I8eED0Hcwgw7iKrfRcuDflzU7p7oBp1E">
        {(props: { data: Array<any>, error: string, meta: Array<any>, loading: Boolean }) => {
          return <p>pepito {props.loading} {props.data && props.data.length}</p>
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
