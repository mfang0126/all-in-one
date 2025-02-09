import { TypingResult } from '@/types/score';
import { Card, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface PronunciationResultItemProps {
  result: TypingResult;
  onResultClick: (uid: string) => void;
}

export function PronunciationResultItem({ result, onResultClick }: PronunciationResultItemProps) {
  return (
    <Card
      className='mb-4'
      onClick={() => onResultClick(result.uid)}
      hoverable
    >
      {/* Header Section */}
      <div className='flex justify-between items-start mb-6'>
        <div>
          <Title
            level={4}
            style={{ marginBottom: '8px' }}
          >
            {result.originalFilename}
          </Title>
          <Text type='secondary'>
            Category: {result.category}
            <span className='mx-2'>•</span>
            ID: {result.uid}
          </Text>
        </div>
        <Text type='secondary'>{dayjs(result.timestamp).format('DD/MM/YYYY, HH:mm:ss')}</Text>
      </div>

      {/* Score Sections */}
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
            {result.calculatedScores.map((score, index) => (
              <div
                key={index}
                className='space-y-1'
              >
                <div className='flex justify-between items-center'>
                  <Text strong>Type:</Text>
                  <Text className='capitalize'>{score.type}</Text>
                </div>
                <div className='flex justify-between items-center'>
                  <Text strong>Confidence:</Text>
                  <Text className='capitalize'>{score.confidence}</Text>
                </div>
                <div className='flex justify-between items-center'>
                  <Text strong>Score:</Text>
                  <Text>{score.calculated.toFixed(3)}</Text>
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
                {index !== result.calculatedScores.length - 1 && <div className='border-b my-2' />}
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
                {result.category
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Text>
            </div>
            <div className='flex flex-col'>
              <Text strong>Original Text:</Text>
              <Text className='mt-1'>{result.text}</Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
