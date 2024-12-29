'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../constants/languages';

interface TranscriptionResult {
  text: string;
}

export default function TranscriptionForm() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('Global English');
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const audioFile = acceptedFiles[0];
    setFile(audioFile);
    setError(null);
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'audio/*': [] } });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

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
    <div>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div>
          <label
            htmlFor='language'
            className='block text-sm font-medium text-gray-700'
          >
            Select Language
          </label>
          <select
            id='language'
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option
                key={lang}
                value={lang}
              >
                {LANGUAGE_CONFIG[lang].label}
              </option>
            ))}
          </select>
        </div>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-4 ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          {file ? <p>File selected: {file.name}</p> : <p>Drag and drop an audio file here, or click to select a file</p>}
        </div>
        <button
          type='submit'
          disabled={!file || isLoading}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300'
        >
          {isLoading ? 'Processing...' : 'Transcribe Audio'}
        </button>
      </form>

      {error && <div className='mt-4 text-red-500'>Error: {error}</div>}

      {audioUrl && (
        <div className='mt-8'>
          <h2 className='text-xl font-bold mb-2'>Audio Preview</h2>
          <audio
            controls
            className='w-full'
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {result && (
        <div className='mt-8'>
          <h2 className='text-xl font-bold mb-2'>Transcription Result</h2>
          <div className='p-4 border rounded'>
            <p className='whitespace-pre-wrap'>{result.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
