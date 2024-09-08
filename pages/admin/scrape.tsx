import { useState } from 'react'
import { NextPage } from 'next'
import React from 'react';

interface ScrapeResult {
  success: boolean;
  error?: string;
  // Add other properties as needed
}

const AdminScrapePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapeResult | null>(null)

  const handleScrape = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/scrape', { method: 'POST' })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Failed to scrape data' })
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Admin: Scrape Data</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleScrape}
        disabled={isLoading}
      >
        {isLoading ? 'Scraping...' : 'Start Scrape'}
      </button>
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Result:</h2>
          <pre className="bg-gray-100 p-4 mt-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default AdminScrapePage
