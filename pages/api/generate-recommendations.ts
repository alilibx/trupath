import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { formData, occupations } = req.body;

    try {
      const systemPrompt = `You are a career advisor AI with extensive knowledge of the U.S. job market. Your task is to provide personalized career recommendations and insights based on user information and occupation data. Analyze the user's age group, interests, and skills, and compare them with the provided occupation data to suggest suitable career paths. If a recommended career is not in the provided occupation list, use your knowledge to provide relevant information about education requirements, job prospects, and salary ranges.`;

      const userPrompt = `Based on the following information:
Age Group: ${formData.ageGroup}
Interests: ${formData.interests}
Skills: ${formData.skills}

And considering the following occupation data:
${occupations.slice(0, 10).map((occ: { occupation: any; entryLevelEducation: any; projectedGrowthRate: any; medianPayStart: any; medianPayEnd: any; }) => `${occ.occupation} (Education: ${occ.entryLevelEducation}, Growth: ${occ.projectedGrowthRate}, Median Pay: $${occ.medianPayStart}-${occ.medianPayEnd})`).join('\n')}

Provide 5 personalized career recommendations for the U.S. job market. For each recommendation:
1. Explain why it's a good fit based on the user's information.
2. Provide information about required education and skills.
3. Discuss job growth prospects and potential salary range.
4. Compare it with similar occupations in the provided data or your knowledge.
5. Suggest a possible career progression path.

Format each recommendation with HTML tags for better readability, using <strong> for emphasis and <ul> for lists where appropriate.`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4",  // You can adjust this to the appropriate model
        messages: messages,
      });

      const recommendations = completion.choices[0].message.content.split('\n\n').filter(line => line.trim() !== '');

      res.status(200).json({ 
        recommendations,
        tokenUsage: completion.usage
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
