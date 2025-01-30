import { DownloadOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';

const { Paragraph } = Typography;

interface TranscriptionResultsProps {
  text: string;
}

export default function TranscriptionResults({ text }: TranscriptionResultsProps) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-medium'>Transcription Results</h3>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <Paragraph>{text}</Paragraph>
    </div>
  );
}
