'use client';

import { useState } from 'react';

export default function TextToSpeechForm() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
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
    <div className='max-w-2xl mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div>
          <label
            htmlFor='text'
            className='block text-sm font-medium text-gray-700'
          >
            Enter text to convert to speech
          </label>
          <textarea
            id='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            rows={6}
            required
          />
        </div>
        <button
          type='submit'
          disabled={!text || isLoading}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300'
        >
          {isLoading ? 'Converting...' : 'Convert to Speech'}
        </button>
      </form>

      {error && (
        <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          <p className='font-bold'>Error:</p>
          <p>{error}</p>
        </div>
      )}

      {audioUrl && (
        <div className='mt-8'>
          <h2 className='text-xl font-bold mb-2'>Generated Speech</h2>
          <audio
            controls
            className='w-full'
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
