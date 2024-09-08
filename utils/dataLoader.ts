import axios from 'axios'
import * as cheerio from 'cheerio'

interface Occupation {
  occupation: string;
  entryLevelEducation: string;
  onTheJobTraining: string;
  projectedNewJobs: string;
  projectedGrowthRate: string;
  medianPayStart: number;
  medianPayEnd: number;
}

export async function scrape_bls_occupations(): Promise<Occupation[]> {
  const url = "https://www.bls.gov/ooh/occupation-finder.htm"
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    
    const occupations: Occupation[] = [];
    const table = $('#occfinder');
    
    table.find('tr').slice(1).each((_, row) => {
      const cells = $(row).find('td');
      const medianPay = cells.eq(5).text().trim();
      const [medianPayStart, medianPayEnd] = parseMedianPay(medianPay);

      const occupation: Occupation = {
        occupation: cells.eq(0).text().trim(),
        entryLevelEducation: cells.eq(1).text().trim(),
        onTheJobTraining: cells.eq(2).text().trim(),
        projectedNewJobs: cells.eq(3).text().trim(),
        projectedGrowthRate: cells.eq(4).text().trim(),
        medianPayStart,
        medianPayEnd
      };
      occupations.push(occupation);
    });
    
    return occupations
  } catch (error) {
    console.error('Error scraping BLS occupations:', error)
    return []
  }
}

function parseMedianPay(medianPay: string): [number, number] {
  const numbers = medianPay.match(/\d+,?\d*/g);
  if (!numbers) return [0, 0];
  
  const parsedNumbers = numbers.map(num => parseInt(num.replace(',', '')));
  
  if (medianPay.includes('or more')) {
    return [parsedNumbers[0], 0];
  } else if (parsedNumbers.length === 2) {
    return [parsedNumbers[0], parsedNumbers[1]];
  }
  
  return [0, 0]; // Default case if parsing fails
}
