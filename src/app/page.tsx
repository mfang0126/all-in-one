import TranscriptionForm from '../components/TranscriptionForm';
import { ContentBox } from '../components/ContentBox';
export default function Home() {
  return (
    <div>
      <ContentBox title='Multi-language Speech-to-Text (Transcription)'>
        <TranscriptionForm />
      </ContentBox>
    </div>
  );
}
