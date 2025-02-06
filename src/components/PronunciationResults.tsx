'use client';

import { TypingResult } from '@/types/score';
import { Typography } from 'antd';
import { DetailedScoreAnalysis } from './DetailedScoreAnalysis';
import { PronunciationResultItem } from './PronunciationResultItem';

const { Title, Text } = Typography;

interface PronunciationResultsProps {
  results: TypingResult[];
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
              <PronunciationResultItem
                key={result.uid}
                result={result}
                onResultClick={onResultClick}
              />
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
