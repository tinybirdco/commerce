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
  const tinybird = useTinybird()

  const router = useRouter()
  
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
    <TinybirdProvider api="https://api.tinybird.co" trackerURL={'https://storage.googleapis.com/tinybird-demo/tinybird-tracker.js'} dataSource={'events'} token={'token'}>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </TinybirdProvider>
  )
}
