import { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';

interface Scholarship {
  id: string;
  name: string;
  provider?: string;
  amount: string;
  deadline: string;
  matchScore: number;
  category?: string;
  type?: string;
}

interface ScholarshipMatchesResult {
  matches: number;
  newThisWeek: number;
  scholarships: Scholarship[];
  totalValue: string;
}

export const useScholarshipMatches = () => {
  const [data, setData] = useState<ScholarshipMatchesResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScholarshipMatches();
  }, []);

  const fetchScholarshipMatches = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getScholarshipMatches');

      // Transform backend data to frontend interface
      const transformedScholarships = result.scholarships.map((scholarship: {
        name: string;
        amount: string;
        deadline: string;
        match: number;
        type: string;
      }, index: number) => ({
        id: `scholarship-${index}`,
        name: scholarship.name,
        provider: scholarship.type,
        amount: scholarship.amount,
        deadline: scholarship.deadline,
        matchScore: scholarship.match,
        category: scholarship.type
      }));

      setData({
        matches: result.matches,
        newThisWeek: result.newThisWeek,
        scholarships: transformedScholarships,
        totalValue: result.totalValue
      });
    } catch (err) {
      console.error('Failed to fetch scholarship matches:', err);
      setError('Failed to load scholarship matches');

      // Graceful fallback with empty data
      setData({
        matches: 0,
        newThisWeek: 0,
        scholarships: [],
        totalValue: 'KSh 0'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    reload: fetchScholarshipMatches
  };
};
