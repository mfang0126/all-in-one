import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';

export async function POST(req: NextRequest) {
  // Validate AssemblyAI API key exists
  if (!process.env.ASSEMBLYAI_API_KEY) {
    return NextResponse.json({ error: 'AssemblyAI API key is not configured' }, { status: 500 });
  }

  // Get and validate file from request
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    console.log('AssemblyAI: Starting transcription...');
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const transcript = await client.transcripts.transcribe({
      audio: buffer
    });

    if (!transcript.text) {
      throw new Error('No transcription text received');
    }

    console.log('AssemblyAI: Transcription complete');
    return NextResponse.json({ text: transcript.text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Transcription failed'
      },
      { status: 500 }
    );
  }
}
