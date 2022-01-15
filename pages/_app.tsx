import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import TinybirdProvider, { useTinybird } from 'next-tinybird'

const Noop: FC = ({ children }) => <>{children}</>

const API_URL = process.env.NEXT_PUBLIC_TINYBIRD_API
const API_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN
const TRACKER_URL = process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_URL

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop
  const router = useRouter()
  const tinybird = useTinybird()

  useEffect(() => {
    tinybird('page-load', { url: router.asPath })

    const handleRouteChange = (url: string) => {
      tinybird('page-load', {
        url,
        product: 'none'
      })
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
      dataSource={'events_demo'}
      token={API_TOKEN}
    >
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </TinybirdProvider>
  )
}
