import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import TinybirdProvider, { useTinybird } from 'next-tinybird'
import { useRouter } from 'next/router'

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

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <TinybirdProvider api="https://api.tinybird.co" trackerURL={'https://storage.googleapis.com/tinybird-demo/tinybird-tracker.js'} dataSource={'events'} token={'p.eyJ1IjogIjE3YjNkMDUzLTNkMjUtNDczNS1hNGUzLTczOTg5YTkyM2M2OCIsICJpZCI6ICIwYWEyOGViNS0zYWJkLTQxNTEtODQyYS1iZGMwMzAzYzcwMjUifQ.dsgIM37qEy-VaMsScud9rNvG_aIQkiA85ZhB8kEHNIk'}>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </TinybirdProvider>
  )
}
