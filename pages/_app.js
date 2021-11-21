import { Provider } from 'react-redux'
import { useStore } from '../store';
import Head from 'next/head'
// Global CSS
import '../assets/styles/index.css';

const MyApp = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState)
  const getLayout = Component.getLayout || (page => page)
  return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
        </Head>
        <Provider store={store}>
          {getLayout(<Component {...pageProps} />)}
        </Provider>
      </>
  )
}

export default MyApp
