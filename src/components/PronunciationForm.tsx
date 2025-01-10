'use client';

import { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload, Button, Alert, Typography, Space, Divider, Input } from 'antd';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;
const { Title } = Typography;
const { TextArea } = Input;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

interface PronunciationResult {
  text: string;
}

export default function PronunciationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [text, setText] = useState<string>(
    "A community's urban forest is an extension of its pride and community spirit. Trees enhance community economic stability by attracting businesses and tourists as people tend to linger and shop longer along tree-lined streets. Apartments and offices in wooded areas rent more quickly and businesses leasing office spaces in developments with trees reported higher productivity and fewer absences."
  );

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'audio/*',
    beforeUpload: (file) => {
      setFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      return false;
    },
    onRemove: () => {
      setFile(null);
      setAudioUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text);

    try {
      const response = await fetch(`${apiUrl}/api/read-aloud/chapter`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResult({ text: data.text }); // Adjust based on your API response structure
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during pronunciation check');
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
        initialValues={{
          text: "A community's urban forest is an extension of its pride and community spirit. Trees enhance community economic stability by attracting businesses and tourists as people tend to linger and shop longer along tree-lined streets. Apartments and offices in wooded areas rent more quickly and businesses leasing office spaces in developments with trees reported higher productivity and fewer absences."
        }}
        layout='vertical'
        onFinish={handleSubmit}
      >
        <Form.Item
          label='Content'
          name='text'
          rules={[{ required: true, message: 'Please enter the content' }]}
        >
          <TextArea
            rows={4}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </Form.Item>

        <Form.Item>
          <Dragger {...uploadProps}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag audio file to this area to upload</p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={isLoading}
            disabled={!file}
            block
          >
            Assess Pronunciation
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
          <Title level={4}>Audio Preview</Title>
          <audio
            controls
            className='w-full'
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
        </>
      )}

      {result && (
        <>
          <Divider />
          <Title level={4}>Pronunciation Result</Title>
          <div className='border rounded p-4'>
            <p className='whitespace-pre-wrap'>{result.text}</p>
          </div>
        </>
      )}
    </Space>
  );
}
