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

      {/* Basic Score Section */}
      <Card className='mb-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Title
              level={2}
              style={{ marginBottom: '4px' }}
            >
              {result.calculatedScores[0]?.calculated.toFixed(2)}
            </Title>
            <Text type='secondary'>Basic Score</Text>
          </div>
          <div>
            <Title
              level={3}
              style={{ marginBottom: '4px' }}
            >
              {result.calculatedScores[0]?.confidence || '-'}
            </Title>
            <Text type='secondary'>Confidence</Text>
          </div>
        </div>
      </Card>

      {/* Advanced Score Section */}
      <Card className='mb-4'>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
          <div className='col-span-2 md:col-span-1'>
            <Title
              level={2}
              style={{ marginBottom: '4px' }}
            >
              {result.calculatedScores[1]?.calculated.toFixed(2)}
            </Title>
            <Text type='secondary'>Advanced Score</Text>
          </div>
          <div>
            <Title
              level={3}
              style={{ marginBottom: '4px' }}
            >
              {result.calculatedScores[1]?.content?.toFixed(2) || '-'}
            </Title>
            <Text type='secondary'>Content</Text>
          </div>
          <div>
            <Title
              level={3}
              style={{ marginBottom: '4px' }}
            >
              {result.calculatedScores[1]?.pronunciation?.toFixed(2) || '-'}
            </Title>
            <Text type='secondary'>Pronunciation</Text>
          </div>
          <div>
            <Title
              level={3}
              style={{ marginBottom: '4px' }}
            >
              {result.calculatedScores[1]?.fluency?.toFixed(2) || '-'}
            </Title>
            <Text type='secondary'>Fluency</Text>
          </div>
          <div>
            <Title
              level={3}
              style={{ marginBottom: '4px' }}
            >
              {result.calculatedScores[1]?.confidence || '-'}
            </Title>
            <Text type='secondary'>Confidence</Text>
          </div>
        </div>
      </Card>

      {/* Text Section */}
      <div>
        <Title
          level={5}
          style={{ marginBottom: '8px' }}
        >
          Original Text
        </Title>
        <Text type='secondary'>{result.text}</Text>
      </div>
    </Card>
  );
}
