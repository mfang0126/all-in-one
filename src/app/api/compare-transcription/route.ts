import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import { SpeechClient } from '@google-cloud/speech';
import { LANGUAGE_CONFIG, type SupportedLanguage } from '../../constants/languages';

export async function POST(req: NextRequest) {
  // Validate AssemblyAI API key exists
  if (!process.env.ASSEMBLYAI_API_KEY) {
    return NextResponse.json({ error: 'AssemblyAI API key is not configured' }, { status: 500 });
  }

  // Get and validate file from request
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const language = formData.get('language') as SupportedLanguage;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!language || !(language in LANGUAGE_CONFIG)) {
    return NextResponse.json({ error: 'Invalid language selected' }, { status: 400 });
  }

  console.log('Converting file to buffer...');
  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const base64Audio = Buffer.from(buffer).toString('base64');
  console.log('File converted to buffer');

  try {
    // Get transcriptions from both services
    console.log('Starting transcription services...');
    const [assemblyAITranscription, googleTranscription] = await Promise.all([
      getAssemblyAITranscription(file, language),
      getGoogleTranscription(base64Audio, language)
    ]);
    console.log('Both transcriptions completed');

    return NextResponse.json({
      assemblyai: assemblyAITranscription,
      google: googleTranscription
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Transcription comparison failed' }, { status: 500 });
  }
}

async function getAssemblyAITranscription(file: File, language: SupportedLanguage) {
  console.log('AssemblyAI: Starting transcription...');

  try {
    if (!process.env.ASSEMBLYAI_API_KEY) {
      throw new Error('AssemblyAI API key is not configured');
    }

    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const transcript = await client.transcripts.transcribe({
      audio: buffer,
      language_code: LANGUAGE_CONFIG[language].assemblyai
    });

    if (!transcript.text) {
      throw new Error('No transcription text received');
    }

    console.log('AssemblyAI: Transcription complete');
    return transcript.text;
  } catch (error) {
    console.error('AssemblyAI transcription error:', error);
    throw new Error('Failed to transcribe audio with AssemblyAI');
  }
}

async function getGoogleTranscription(base64Audio: string, language: SupportedLanguage) {
  console.log('Google: Initializing client...');
  // Initialize Google Speech client
  const speechClient = new SpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });

  console.log('Google: Starting transcription...');
  // Get transcription
  const [googleResponse] = await speechClient.recognize({
    audio: { content: base64Audio },
    config: {
      encoding: 'MP3',
      sampleRateHertz: 44100,
      languageCode: LANGUAGE_CONFIG[language].google
    }
  });
  console.log('Google: Transcription complete');

  // Combine all transcription results
  return googleResponse.results?.map((result) => result.alternatives?.[0]?.transcript).join('\n') || '';
}
