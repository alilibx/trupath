import type { NextApiRequest, NextApiResponse } from 'next'
import { scrape_bls_occupations } from '@/utils/dataLoader'
import fs from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'occupations.json')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      let occupations
      try {
        const data = await fs.readFile(dataFilePath, 'utf-8')
        occupations = JSON.parse(data)
      } catch (error) {
        // File doesn't exist or can't be read, so scrape the data
        occupations = await scrape_bls_occupations()
        await fs.writeFile(dataFilePath, JSON.stringify(occupations, null, 2))
      }
      res.status(200).json({ success: true, data: occupations })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to load or scrape occupations' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
