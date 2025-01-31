'use client';

import { Typography } from 'antd';
import { TypingResult } from '@/types/score';
import { processScoreResult } from '@/utils/scoreProcessing';
import ScoredText from './ScoredText';

const { Title, Text } = Typography;

interface DetailedScoreAnalysisProps {
  result: TypingResult;
}

export function DetailedScoreAnalysis({ result }: DetailedScoreAnalysisProps) {
  const { scoreInfo } = processScoreResult(result);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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
        <div className='grid grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <Title
                level={4}
                className='mb-2'
              >
                Basic Scores
              </Title>
              <div>
                <div className='flex justify-between items-center'>
                  <Text strong>Standard Score:</Text>
                  <Text>{scoreInfo.score.standard?.toFixed(3)}</Text>
                </div>
                <div className='flex justify-between items-center'>
                  <Text strong>Accuracy Score:</Text>
                  <Text>{scoreInfo.score.accuracy?.toFixed(3)}</Text>
                </div>
                <div className='flex justify-between items-center'>
                  <Text strong>Fluency Score:</Text>
                  <Text>{scoreInfo.score.fluency?.toFixed(3)}</Text>
                </div>
                <div className='flex justify-between items-center'>
                  <Text strong>Integrity Score:</Text>
                  <Text>{scoreInfo.score.integrity?.toFixed(3)}</Text>
                </div>
                <div className='flex justify-between items-center'>
                  <Text strong>Total Score:</Text>
                  <Text>{scoreInfo.score.total?.toFixed(3)}</Text>
                </div>
              </div>
            </div>

            <div>
              <Title
                level={4}
                className='mb-2'
              >
                Calculated Scoring
              </Title>
              <div className='space-y-2'>
                {scoreInfo.calculatedScore.map((score, index) => (
                  <div key={index}>
                    <div className='flex justify-between items-center'>
                      <Text strong>Type:</Text>
                      <Text>{score.type.toUpperCase()}</Text>
                    </div>
                    <div className='flex justify-between items-center'>
                      <Text strong>Calculated Score:</Text>
                      <Text>{score.calculated?.toFixed(3)}</Text>
                    </div>
                    <div className='flex justify-between items-center'>
                      <Text strong>Confidence:</Text>
                      <Text className='capitalize'>{score.confidence}</Text>
                    </div>
                    <div className='flex justify-between items-center'>
                      <Text strong>Normalized Score:</Text>
                      <Text>{score.normalized?.toFixed(3)}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Title
              level={4}
              className='mb-2'
            >
              Recording Information
            </Title>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <Text strong>Original Filename:</Text>
                <Text className='ml-2'>{result.originalFilename}</Text>
              </div>
              <div className='flex justify-between items-center'>
                <Text strong>Category:</Text>
                <Text className='ml-2'>{scoreInfo.category}</Text>
              </div>
              <div className='flex flex-col'>
                <Text strong>Original Text:</Text>
                <Text>{result.assessment.sentence.text}</Text>
              </div>
            </div>
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
}
