'use client';

import { useState, useEffect } from 'react';
import { message } from 'antd';
import { TypingResult } from '@/types/score';
import PronunciationForm from '@/components/PronunciationForm';
import PronunciationResults from '@/components/PronunciationResults';
import { ContentBox } from '@/components/ContentBox';

export default function PronunciationPage() {
  const [messageApi, contextHolder] = message.useMessage();

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [text, setText] = useState<string>(DEFAULT_TEXT);
  const [submittedUid, setSubmittedUid] = useState<string | null>(null);
  const [checkingResult, setCheckingResult] = useState(false);

  // Results states
  const [results, setResults] = useState<TypingResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [currentResult, setCurrentResult] = useState<TypingResult | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch results on mount and when new assessment is submitted
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PTE_API_KEY}`
          },
          body: JSON.stringify({ type: 'all' })
        });
        const { results: fetchedResults } = await response.json();
        setResults(
          fetchedResults.sort((a: TypingResult, b: TypingResult) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [submittedUid]);

  // Check for submitted assessment result
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkResult = async () => {
      if (!submittedUid || checkingResult) return;

      try {
        setCheckingResult(true);
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PTE_API_KEY}`
          },
          body: JSON.stringify({ type: 'all' })
        });

        const { results } = await response.json();
        const submittedResult = results.find((r: TypingResult) => r.uid === submittedUid);

        if (submittedResult) {
          if (submittedResult.status === 'completed') {
            messageApi.success('Audio file has been scored successfully!');
            setSubmittedUid(null);
            clearInterval(intervalId);
          } else if (submittedResult.status === 'failed') {
            messageApi.error('Audio file scoring failed. Please try again.');
            setSubmittedUid(null);
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error('Error checking results:', error);
      } finally {
        setCheckingResult(false);
      }
    };

    if (submittedUid) {
      checkResult();
      intervalId = setInterval(checkResult, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [submittedUid, messageApi, checkingResult]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/read-aloud/chapter', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PTE_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
        throw new Error(errorData.message || 'Failed to assess pronunciation. Please try again.');
      }

      const data = await response.json();

      // Reset states
      setFile(null);
      setAudioUrl(null);
      setText(DEFAULT_TEXT);
      setSubmittedUid(data.result.uid);
      messageApi.success('Audio file uploaded successfully. Processing...');
    } catch (error) {
      console.error('Error:', error);
      const userFriendlyMessage =
        error instanceof Error && error.message !== 'Something went wrong'
          ? error.message
          : 'Failed to assess pronunciation. Please try again later.';

      setError(userFriendlyMessage);
      messageApi.error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = async (uid: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/results/${uid}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PTE_API_KEY}`
        },
        body: JSON.stringify({ type: 'all' })
      });
      const result = (await response.json()) as TypingResult;
      setCurrentResult(result);
    } catch (error) {
      console.error('Failed to fetch result details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setError(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } else {
      setAudioUrl(null);
    }
  };

  return (
    <>
      {contextHolder}
      <ContentBox title='Pronunciation'>
        <PronunciationForm
          file={file}
          text={text}
          audioUrl={audioUrl}
          isLoading={isLoading}
          error={error}
          onFileChange={handleFileChange}
          onTextChange={setText}
          onSubmit={handleSubmit}
        />
      </ContentBox>
      <PronunciationResults
        results={results}
        currentResult={currentResult}
        loading={loadingResults}
        loadingDetails={loadingDetails}
        onResultClick={handleResultClick}
      />
    </>
  );
}

const DEFAULT_TEXT =
  "A community's urban forest is an extension of its pride and community spirit. Trees enhance community economic stability by attracting businesses and tourists as people tend to linger and shop longer along tree-lined streets. Apartments and offices in wooded areas rent more quickly and businesses leasing office spaces in developments with trees reported higher productivity and fewer absences.";
