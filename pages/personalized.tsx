import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import axios from 'axios';

interface Occupation {
  occupation: string;
  entryLevelEducation: string;
  onTheJobTraining: string;
  projectedNewJobs: string;
  projectedGrowthRate: string;
  medianPayStart: number;
  medianPayEnd: number;
}

const PersonalizedPath: NextPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ageGroup: '',
    interests: '',
    skills: '',
  });
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<{ prompt_tokens: number; completion_tokens: number; total_tokens: number } | null>(null);

  useEffect(() => {
    fetchOccupations();
  }, []);

  const fetchOccupations = async () => {
    try {
      const response = await axios.get('/api/data');
      setOccupations(response.data.data);
    } catch (error) {
      console.error('Error fetching occupations:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setStep(4); // Move to the recommendation step immediately to show loading
    try {
      const response = await axios.post('/api/generate', {
        formData,
        occupations
      });
      setRecommendations(response.data.recommendations);
      setTokenUsage(response.data.tokenUsage);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations(['An error occurred while generating recommendations. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ageGroup: '',
      interests: '',
      skills: '',
    });
    setRecommendations([]);
    setTokenUsage(null);
    setStep(1);
  };

  return (
    <div className="container mx-auto mt-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Your Personalized Career Path</h1>
      
      <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                {i}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-600 rounded">
            <div 
              className="h-full bg-blue-500 rounded transition-all duration-500 ease-in-out" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="ageGroup">
                Age Group
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
              >
                <option value="">Select age group</option>
                <option value="14-17">14-17</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Interests</h2>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="interests">
                What are your main interests or passions?
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                id="interests"
                name="interests"
                rows={4}
                placeholder="Describe your interests..."
                value={formData.interests}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Skills</h2>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="skills">
                What skills do you have or want to develop?
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                id="skills"
                name="skills"
                rows={4}
                placeholder="List your skills..."
                value={formData.skills}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white text-center">Your Career Recommendations</h2>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-300">Analyzing your profile and generating personalized recommendations...</p>
              </div>
            ) : (
              <>
                <p className="mb-6 text-gray-300 text-center">
                  Based on your age group ({formData.ageGroup}), interests, and skills, 
                  here are some personalized career paths and insights for you to consider:
                </p>
                <div className="space-y-6">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md">
                      <h3 className="text-xl font-semibold mb-2 text-blue-400">Career Option {index + 1}</h3>
                      <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: recommendation }}></div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-gray-400 text-sm italic text-center">
                  These suggestions are tailored to your profile and current job market trends. 
                  For a more comprehensive analysis, consider consulting with a professional career counselor.
                </p>
                {tokenUsage && (
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    AI Usage: {tokenUsage.total_tokens} tokens (Prompt: {tokenUsage.prompt_tokens}, Response: {tokenUsage.completion_tokens})
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && step < 4 && (
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
              Get Recommendations
            </button>
          )}
        </div>
      </div>

      {step === 4 && (
        <div className="text-center mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleReset}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalizedPath;