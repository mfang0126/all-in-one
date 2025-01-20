'use client';

import { useEffect, useState } from 'react';
import { Result } from '@/types/result';
import { TypingResult } from '@/types/score';
import { processScoreResult } from '../utils/scoreProcessing';
import ScoredText from './ScoredText';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

export default function PronunciationResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentResult, setCurrentResult] = useState<TypingResult | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleResultClick = async (uid: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/results/${uid}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PTE_API_KEY}`
        }
      });
      const result = (await response.json()) as TypingResult;
      setCurrentResult(result);
      console.log(result.score.normalizedScore);
    } catch (error) {
      console.error('Failed to fetch result details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='mt-4 space-y-4'>
      {/* Results List Section */}
      <div className='p-4 border rounded-lg bg-white shadow'>
        <Title
          level={3}
          className='mb-4'
        >
          All Assessments
        </Title>
        {results.length === 0 ? (
          <Text type='secondary'>No assessments found.</Text>
        ) : (
          <ul className='space-y-4'>
            {results.map((result) => (
              <li
                key={result.uid}
                className='p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                onClick={() => handleResultClick(result.uid)}
              >
                <div className='flex justify-between items-start'>
                  {result?.score !== undefined ? (
                    <>
                      <div>
                        <Text strong>{result.text}</Text>
                      </div>
                      <div className='text-right min-w-[200px] space-y-1'>
                        <div>
                          <Text type='secondary'>{new Date(result.timestamp).toLocaleString()}</Text>
                        </div>
                        <div>
                          <Text
                            type='secondary'
                            className='truncate max-w-[180px] inline-block cursor-pointer hover:bg-gray-100 px-1 rounded'
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(result.uid);
                            }}
                            title={result.uid}
                          >
                            ID: {result.uid}
                          </Text>
                        </div>
                        <div>
                          <Text type='secondary'>Score: {result.score}</Text>
                        </div>
                        <div>
                          <Text type='secondary'>Category: {result.category}</Text>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='w-full'>
                      <div className='flex justify-between items-center'>
                        <Text
                          type='warning'
                          className='text-lg'
                        >
                          Processing Assessment...
                        </Text>
                        <Text
                          type='secondary'
                          className='truncate max-w-[180px] inline-block cursor-pointer hover:bg-gray-100 px-1 rounded'
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(result.uid);
                          }}
                          title={result.uid}
                        >
                          ID: {result.uid}
                        </Text>
                      </div>
                      <div className='mt-2'>
                        <Text type='warning'>Please reload the page to check for updates.</Text>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Result Analysis */}
      {loadingDetails ? (
        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='flex items-center justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        </div>
      ) : (
        currentResult && <DetailedScoreAnalysis result={currentResult} />
      )}
    </div>
  );
}

// Separate component for the detailed score analysis
const DetailedScoreAnalysis: React.FC<{ result: TypingResult }> = ({ result }) => {
  const { scoreInfo, coloredSegments } = processScoreResult(result);

  console.log(coloredSegments);
  return (
    <div className='space-y-4'>
      {/* Basic Information */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <div className='flex justify-between items-start'>
          <div>
            <Title level={3}>Recording Details</Title>
            <Text
              type='secondary'
              className='truncate max-w-[280px] inline-block cursor-pointer hover:bg-gray-100 px-1 rounded'
              onClick={() => copyToClipboard(result.uid)}
              title={result.uid}
            >
              ID: {result.uid}
            </Text>
          </div>
          <div className='text-right'>
            <Text type='secondary'>{new Date(result.timestamp).toLocaleString()}</Text>
          </div>
        </div>
      </div>

      {/* Score Information */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <Title
          level={3}
          className='mb-2'
        >
          Score Analysis
        </Title>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Title
              level={4}
              className='mb-2'
            >
              Score Details
            </Title>
            <div className='space-y-1'>
              <Text>Normalized Score: {scoreInfo.normalizedScore.toFixed(2)}</Text>
              <br />
              <Text>Confidence: {scoreInfo.confidence}</Text>
              <br />
              <Text>Category: {scoreInfo.category}</Text>
            </div>
          </div>
          <div>
            <Title
              level={4}
              className='mb-2'
            >
              Original Text
            </Title>
            <Text>{result.assessment.sentence.text}</Text>
          </div>
        </div>
      </div>

      {/* Pronunciation Analysis */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <Title
          level={3}
          className='mb-2'
        >
          Pronunciation Analysis
        </Title>
        <ScoredText sentence={result.assessment.sentence} />
      </div>
    </div>
  );
};
