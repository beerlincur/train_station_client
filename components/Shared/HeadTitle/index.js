import Head from 'next/head'

const DlHeadTitle = ({ title }) => {
  return (
    <Head>
      <title>{`${title} | DokuchaevLab`}</title>
      <meta name="title" content={`${title} | DokuchaevLab`} />
    </Head>
  )
}

export default DlHeadTitle

