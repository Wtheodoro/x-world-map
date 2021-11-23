import axios from 'axios'
import { SWRConfig } from 'swr'
import Head from 'next/head'

import { AppProvider } from '@contexts/App'
import AppLayout from '@components/AppLayout'

import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => axios.get(resource, init).then(res => res.data),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <AppProvider {...pageProps}>
        <AppLayout>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>X-Map | X-Team</title>
          </Head>
          <Component />
        </AppLayout>
      </AppProvider>
    </SWRConfig>
  )
}

export default App
