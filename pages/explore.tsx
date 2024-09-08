import { useState, useEffect } from 'react'
import axios from 'axios'

interface Occupation {
  occupation: string;
  entryLevelEducation: string;
  onTheJobTraining: string;
  projectedNewJobs: string;
  projectedGrowthRate: string;
  medianPayStart: number;
  medianPayEnd: number;
}

export default function ExplorePage() {
  const [occupations, setOccupations] = useState<Occupation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [educationFilter, setEducationFilter] = useState('')
  const [growthFilter, setGrowthFilter] = useState('')

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        const response = await axios.get('/api/data')
        setOccupations(response.data.data)
      } catch (err) {
        setError('Failed to load occupations')
      } finally {
        setLoading(false)
      }
    }

    fetchOccupations()
  }, [])

  if (loading) return <div className="text-white">Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  const filteredOccupations = occupations.filter(occ => 
    occ.occupation.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (educationFilter ? occ.entryLevelEducation === educationFilter : true) &&
    (growthFilter ? occ.projectedGrowthRate === growthFilter : true)
  )

  const totalOccupations = filteredOccupations.length
  const averageMedianPay = calculateAverageMedianPay(filteredOccupations)
  const topGrowingOccupations = getTopGrowingOccupations(filteredOccupations, 5)
  const educationDistribution = getEducationDistribution(filteredOccupations)
  const growthDistribution = getGrowthDistribution(filteredOccupations)

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Occupation Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Occupations" value={totalOccupations} />
        <StatCard title="Average Median Pay" value={`$${averageMedianPay.toLocaleString()}`} />
        <StatCard title="Most Common Education" value={getMostCommonEducation(educationDistribution)} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top 5 Growing Occupations</h2>
        <ul className="list-disc pl-5">
          {topGrowingOccupations.map((occ, index) => (
            <li key={index}>
              {occ.occupation} - Growth Rate: {occ.projectedGrowthRate}
              <br />
              Median Pay: {formatMedianPay(occ.medianPayStart, occ.medianPayEnd)}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Education Distribution</h2>
        <ul className="list-disc pl-5">
          {Object.entries(educationDistribution).map(([education, count]) => (
            <li key={education}>{education}: {count} occupation{count !== 1 ? 's' : ''}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Growth Rate Distribution</h2>
        <ul className="list-disc pl-5">
          {Object.entries(growthDistribution).map(([rate, count]) => (
            <li key={rate}>{rate}: {count} occupation{count !== 1 ? 's' : ''}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Occupations Table</h2>
        
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search occupations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded w-full"
            />
          </div>
          <div className="flex items-center">
            <select
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded w-full"
            >
              <option value="">All Education Levels</option>
              {Object.keys(educationDistribution).map(edu => (
                <option key={edu} value={edu}>{edu}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <select
              value={growthFilter}
              onChange={(e) => setGrowthFilter(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded w-full"
            >
              <option value="">All Growth Rates</option>
              {Object.keys(growthDistribution).map(rate => (
                <option key={rate} value={rate}>{rate}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                setSearchTerm('');
                setEducationFilter('');
                setGrowthFilter('');
              }}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">Occupation</th>
              <th className="p-2">Education</th>
              <th className="p-2">Growth Rate</th>
              <th className="p-2">Median Pay</th>
            </tr>
          </thead>
          <tbody>
            {filteredOccupations.map((occ, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : ''}>
                <td className="p-2">{occ.occupation}</td>
                <td className="p-2">{occ.entryLevelEducation}</td>
                <td className="p-2">{occ.projectedGrowthRate}</td>
                <td className="p-2">{formatMedianPay(occ.medianPayStart, occ.medianPayEnd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function calculateAverageMedianPay(occupations: Occupation[]): number {
  const totalPay = occupations.reduce((sum, occ) => {
    const avgPay = occ.medianPayEnd ? (occ.medianPayStart + occ.medianPayEnd) / 2 : occ.medianPayStart;
    return sum + avgPay;
  }, 0);
  
  return Math.round(totalPay / occupations.length);
}

function getTopGrowingOccupations(occupations: Occupation[], count: number): Occupation[] {
  const growthRates: { [key: string]: number } = {
    'Much faster than average': 5,
    'Faster than average': 4,
    'As fast as average': 3,
    'Slower than average': 2,
    'Decline': 1
  }

  return occupations
    .sort((a, b) => (growthRates[b.projectedGrowthRate] || 0) - (growthRates[a.projectedGrowthRate] || 0))
    .slice(0, count)
}

function getEducationDistribution(occupations: Occupation[]): Record<string, number> {
  return occupations.reduce((acc, occ) => {
    const education = occ.entryLevelEducation || 'Unknown'
    acc[education] = (acc[education] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

function formatMedianPay(start: number, end: number): string {
  if (end === 0) {
    return `$${(start / 1000).toLocaleString()}k or more`;
  } else {
    return `$${(start / 1000).toLocaleString()}k to $${(end / 1000).toLocaleString()}k`;
  }
}

function getGrowthDistribution(occupations: Occupation[]): Record<string, number> {
  return occupations.reduce((acc, occ) => {
    const growth = occ.projectedGrowthRate
    acc[growth] = (acc[growth] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

function getMostCommonEducation(educationDistribution: Record<string, number>): string {
  return Object.entries(educationDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0]
}