import Head from 'next/head'

const DlHeadTitle = ({ title }) => {
  return (
    <Head>
      <title>{`${title} | Железнодорожная станция`}</title>
      <meta name="title" content={`${title} | Железнодорожная станция`} />
    </Head>
  )
}

export default DlHeadTitle

