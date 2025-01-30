'use client';

import { useState } from 'react';
import { Space } from 'antd';
import TranscriptionForm from '@/components/TranscriptionForm';
import AudioPreview from '@/components/AudioPreview';
import TranscriptionResults from '@/components/TranscriptionResults';
import { ContentBox } from '@/components/ContentBox';
import { SupportedLanguage } from './constants/languages';

interface TranscriptionResult {
  text: string;
}

export default function TranscriptionPage() {
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } else {
      setAudioUrl(null);
    }
    setError(null);
  };

  const handleSubmit = async (file: File, language: SupportedLanguage) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during transcription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentBox title='Multi-language Speech-to-Text (Transcription)'>
      <Space
        direction='vertical'
        className='w-full'
      >
        <TranscriptionForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          onFileChange={handleFileChange}
        />
        {audioUrl && <AudioPreview audioUrl={audioUrl} />}
        {result && <TranscriptionResults text={result.text} />}
      </Space>
    </ContentBox>
  );
}
