'use client';

import { useEffect, useState } from 'react';
import { Result } from '@/types/result';

export default function PronunciationResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentResult, setCurrentResult] = useState<Result | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PTE_API_KEY}`
          }
        });
        const { results: fetchedResults } = await response.json();
        setResults(fetchedResults);
        // Set the most recent result as current result
        if (fetchedResults && fetchedResults.length > 0) {
          setCurrentResult(fetchedResults[0]);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='mt-4 space-y-4'>
      {/* Current Result Card */}
      {currentResult && (
        <div className='p-4 border rounded-lg bg-white shadow'>
          <div className='space-y-4'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-lg font-semibold'>Latest Recording Details</h3>
                <p className='text-sm text-gray-500'>ID: {currentResult.uid}</p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-gray-500'>{new Date(currentResult.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium mb-2'>Score</h4>
                {currentResult.score !== undefined ? (
                  <div className='text-2xl font-bold text-blue-600'>{currentResult.score.toFixed(2)}</div>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <span className='text-yellow-600 font-medium'>Pending</span>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600'></div>
                  </div>
                )}
              </div>

              <div>
                <h4 className='font-medium mb-2'>Category</h4>
                <p className='text-gray-700'>{currentResult.category}</p>
              </div>

              <div>
                <h4 className='font-medium mb-2'>Original Filename</h4>
                <p className='text-gray-700 break-all'>{currentResult.originalFilename}</p>
              </div>

              <div>
                <h4 className='font-medium mb-2'>Timestamp</h4>
                <p className='text-gray-700'>{new Date(currentResult.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className='font-medium mb-2'>Original Text</h4>
              <p className='text-gray-700'>{currentResult.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Previous Results Section */}
      <div className='p-4 border rounded-lg bg-white shadow'>
        <h3 className='text-lg font-semibold mb-4'>Previous Assessments</h3>
        {results.length === 0 ? (
          <p className='text-gray-500'>No previous assessments found.</p>
        ) : (
          <ul className='space-y-4'>
            {results.map((result) => (
              <li
                key={result.uid}
                className='p-4 border rounded-lg hover:bg-gray-50'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-medium'>{result.text}</p>
                    <p className='text-sm text-gray-500 mt-1'>Score: {result.score ?? 'Pending'}</p>
                  </div>
                  <time className='text-sm text-gray-500'>{new Date(result.timestamp).toLocaleDateString()}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Debug JSON View */}
      {currentResult && (
        <div className='p-4 border rounded-lg bg-gray-50'>
          <h3 className='text-lg font-semibold mb-2'>Debug JSON</h3>
          <pre className='bg-gray-100 p-4 rounded overflow-auto max-h-96'>{JSON.stringify(currentResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
