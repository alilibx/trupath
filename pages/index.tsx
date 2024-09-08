// pages/index.tsx
import Head from 'next/head'

export default function Home() {
  return (
    <div className="container mx-auto mt-8">
      <Head>
        <title>Trupath - Career Development</title>
        <meta name="description" content="Discover your ideal career path with data-driven insights" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold mb-4">Welcome to Trupath</h1>
        <p className="mb-4">Discover your ideal career path with data-driven insights.</p>
        {/* Add more content here */}
      </main>
    </div>
  )
}