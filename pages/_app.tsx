import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import TinybirdProvider, { useTinybird } from '@tinybirdco/next-tinybird'

const Noop: FC = ({ children }) => <>{children}</>

const API_TRACKER_URL = process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_API
const API_TRACKER_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  return (
    <TinybirdProvider
      dataSource={'images_ranking'}
      token={String(API_TRACKER_TOKEN)}
    >
      <>
        <Head />
        <ManagedUIContext>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ManagedUIContext>
      </>
    </TinybirdProvider>
  )
}
