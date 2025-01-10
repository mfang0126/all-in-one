import { ContentBox } from '@/components/ContentBox';
import PronunciationForm from '@/components/PronunciationForm';
import PronunciationResults from '@/components/PronunciationResults';

export default function PronunciationPage() {
  return (
    <>
      <ContentBox title='Pronunciation Assessment'>
        <PronunciationForm />
      </ContentBox>
      <ContentBox title='Pronunciation Results'>
        <PronunciationResults />
      </ContentBox>
    </>
  );
}
