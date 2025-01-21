'use client';

import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Form, Select, Upload, Button, Alert, Typography, Space, Divider } from 'antd';
import type { UploadProps } from 'antd';
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../app/constants/languages';

const { Dragger } = Upload;
const { Title } = Typography;

interface TranscriptionResult {
  assemblyai: {
    text: string;
    duration: number;
  };
  google: {
    text: string;
    duration: number;
  };
  timing: {
    total: number;
    assemblyai: number;
    google: number;
  };
}

export default function ComparisonForm() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('Global English');
  const [results, setResults] = useState<TranscriptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'audio/*',
    beforeUpload: (file) => {
      setFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      return false; // Prevent automatic upload
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
    formData.append('language', language);

    try {
      const response = await fetch('/api/compare-transcription', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription comparison failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during transcription comparison');
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
          label='Select Language'
          required
        >
          <Select
            value={language}
            onChange={(value) => setLanguage(value as SupportedLanguage)}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <Select.Option
                key={lang}
                value={lang}
              >
                {LANGUAGE_CONFIG[lang].label}
              </Select.Option>
            ))}
          </Select>
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
            Compare Transcription
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

      {results && (
        <>
          <Divider />
          <div className='text-center mb-4'>
            <p>Total Time: {results.timing.total}ms</p>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='border rounded p-4'>
              <Title level={4}>AssemblyAI Transcription</Title>
              <p className='text-sm text-gray-500 mb-2'>Time taken: {results.timing.assemblyai}ms</p>
              <p className='whitespace-pre-wrap'>{results.assemblyai.text.slice(0, 500)}...</p>
            </div>
            <div className='border rounded p-4'>
              <Title level={4}>Google Speech-to-Text</Title>
              <p className='text-sm text-gray-500 mb-2'>Time taken: {results.timing.google}ms</p>
              <p className='whitespace-pre-wrap'>{results.google.text.slice(0, 500)}...</p>
            </div>
          </div>
        </>
      )}
    </Space>
  );
}
