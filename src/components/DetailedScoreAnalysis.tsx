'use client';

import { message, Typography } from 'antd';
import { CalculatedScore, TypingResult } from '@/types/score';
import { processScoreResult } from '@/utils/scoreProcessing';
import ScoredText from './ScoredText';
import { ContentTitle } from './ContentBox';

const { Title, Text } = Typography;

interface DetailedScoreAnalysisProps {
  result: TypingResult;
}

export function DetailedScoreAnalysis({ result }: DetailedScoreAnalysisProps) {
  const [messageApi, contextHolder] = message.useMessage();
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
      <ContentTitle
        title='Selected Result Analysis'
        className='my-8'
      />
      {contextHolder}
      {/* Recording Details */}
      <div className='bg-white p-4 rounded-lg'>
        <div className='flex justify-between items-start'>
          <div>
            <Title level={3}>Recording Details</Title>
            <Text
              type='secondary'
              className='truncate inline-block cursor-pointer hover:bg-gray-100 px-1 rounded'
              onClick={() => {
                copyToClipboard(result.uid);
                messageApi.success('Recording ID copied to clipboard');
              }}
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

      {/* Score Analysis */}
      <div className='bg-white p-4 rounded-lg'>
        <Title
          level={3}
          className='mb-4'
        >
          Score Analysis
        </Title>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div>
            <Title
              level={4}
              className='mb-2'
            >
              Calculated Scores
            </Title>
            <div className='space-y-4'>
              {scoreInfo.calculatedScores.map((score: CalculatedScore, index: number) => (
                <div
                  key={index}
                  className='space-y-1'
                >
                  <div className='flex justify-between items-center'>
                    <Text strong>Type:</Text>
                    <Text className='capitalize'>{score.type}</Text>
                  </div>
                  <div className='flex justify-between items-center'>
                    <Text strong>Score:</Text>
                    <Text>{score.calculated?.toFixed(3)}</Text>
                  </div>
                  {score.content && (
                    <div className='flex justify-between items-center'>
                      <Text strong>Content:</Text>
                      <Text>{score.content.toFixed(3)}</Text>
                    </div>
                  )}
                  {score.pronunciation && (
                    <div className='flex justify-between items-center'>
                      <Text strong>Pronunciation:</Text>
                      <Text>{score.pronunciation.toFixed(3)}</Text>
                    </div>
                  )}
                  {score.fluency && (
                    <div className='flex justify-between items-center'>
                      <Text strong>Fluency:</Text>
                      <Text>{score.fluency.toFixed(3)}</Text>
                    </div>
                  )}
                  {index !== scoreInfo.calculatedScores.length - 1 && <div className='border-b my-2' />}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
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
                <Text className='ml-2 truncate'>{result.originalFilename}</Text>
              </div>
              <div className='flex justify-between items-center'>
                <Text strong>Category:</Text>
                <Text className='ml-2'>
                  {scoreInfo.category
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Text>
              </div>
              <div className='flex flex-col'>
                <Text strong>Original Text:</Text>
                <Text className='mt-1'>{result.assessment.sentence.text}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pronunciation Analysis */}
      <div className='bg-white p-4 rounded-lg'>
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
