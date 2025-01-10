'use client';

import { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Space, Divider } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

export default function TextToSpeechForm() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { text: string }) => {
    if (!values.text) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: values.text })
      });

      const contentType = response.headers.get('Content-Type');

      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Text-to-speech conversion failed');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (contentType !== 'audio/mpeg') {
        throw new Error(`Unexpected content type: ${contentType}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during text-to-speech conversion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space
      direction='vertical'
      className='w-full'
    >
      <Form
        layout='vertical'
        onFinish={handleSubmit}
      >
        <Form.Item
          label='Enter text to convert to speech'
          name='text'
          rules={[{ required: true, message: 'Please enter some text' }]}
        >
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={isLoading}
            block
          >
            Convert to Speech
          </Button>
        </Form.Item>
      </Form>

      {error && (
        <Alert
          message={error}
          type='error'
          showIcon
        />
      )}

      {audioUrl && (
        <>
          <Divider />
          <Title level={4}>Generated Speech</Title>
          <audio
            controls
            className='w-full'
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
        </>
      )}
    </Space>
  );
}
