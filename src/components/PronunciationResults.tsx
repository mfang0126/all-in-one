'use client';

import { Result } from '@/types/result';
import { TypingResult } from '@/types/score';
import { Typography } from 'antd';
import { DetailedScoreAnalysis } from './DetailedScoreAnalysis';

const { Title, Text } = Typography;

interface PronunciationResultsProps {
  results: Result[];
  currentResult: TypingResult | null;
  loading: boolean;
  loadingDetails: boolean;
  onResultClick: (uid: string) => void;
}

export default function PronunciationResults({
  results,
  currentResult,
  loading,
  loadingDetails,
  onResultClick
}: PronunciationResultsProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
                onClick={() => onResultClick(result.uid)}
              >
                <div className='flex justify-between items-start'>
                  {result?.status === 'completed' ? (
                    <>
                      <div className='flex-1 flex flex-col gap-2'>
                        <Text
                          strong
                          className='text-lg'
                        >
                          {result.originalFilename}
                        </Text>
                        <Text className='text-gray-600'>{result.text}</Text>
                      </div>
                      <div className='ml-8 text-right space-y-4'>
                        <div>
                          <Text
                            type='secondary'
                            className='text-sm'
                          >
                            {new Date(result.timestamp).toLocaleString()}
                          </Text>
                          <div className='mt-1'>
                            <Text
                              type='secondary'
                              className='text-xs truncate max-w-[180px] inline-block cursor-pointer hover:bg-gray-100 px-1 rounded'
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
                            <Text
                              type='secondary'
                              className='text-sm'
                            >
                              Category: {result.category}
                            </Text>
                          </div>
                        </div>

                        <div className='border rounded p-3 bg-gray-50'>
                          <Text
                            strong
                            className='block mb-2'
                          >
                            Basic Scores
                          </Text>
                          <div className='space-y-1 text-sm'>
                            <div className='flex justify-between'>
                              <Text type='secondary'>Standard:</Text>
                              <Text>{result.score?.standard?.toFixed(2)}</Text>
                            </div>
                            <div className='flex justify-between'>
                              <Text type='secondary'>Accuracy:</Text>
                              <Text>{result.score?.accuracy?.toFixed(2)}</Text>
                            </div>
                            <div className='flex justify-between'>
                              <Text type='secondary'>Fluency:</Text>
                              <Text>{result.score?.fluency?.toFixed(2)}</Text>
                            </div>
                            <div className='flex justify-between'>
                              <Text type='secondary'>Integrity:</Text>
                              <Text>{result.score?.integrity?.toFixed(2)}</Text>
                            </div>
                            <div className='flex justify-between'>
                              <Text type='secondary'>Total:</Text>
                              <Text>{result.score?.total?.toFixed(2)}</Text>
                            </div>
                          </div>
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
