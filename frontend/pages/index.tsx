import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Hack the North</title>
      </Head>
      <main className="h-screen w-full bg-gray-100 flex justify-center">
        <p>Hmmm, you're not logged in. <a>Click here to log in.</a></p>
      </main>
    </>
  )
}
