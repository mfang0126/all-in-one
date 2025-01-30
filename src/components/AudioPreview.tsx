import { Typography, Divider } from 'antd';

const { Title } = Typography;

interface AudioPreviewProps {
  audioUrl: string;
}

export default function AudioPreview({ audioUrl }: AudioPreviewProps) {
  return (
    <>
      <Divider />
      <Title level={4}>Audio Preview</Title>
      <audio
        controls
        className='w-full'
        src={audioUrl}
      >
        Your browser does not support the audio element.
      </audio>
    </>
  );
}
