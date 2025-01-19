export type ScoreQuality = 'excellent' | 'good' | 'poor';

export interface TypingResult {
  score: {
    calculatedScore: number;
    normalizedScore: number;
    confidence: 'high' | 'medium' | 'low';
  };
  category: string;
  timestamp: string;
  assessment: {
    sentence: {
      text: string;
      score: number;
      start: number;
      end: number;
      words: Array<{
        text: string;
        score: number;
        start: number;
        end: number;
        syllables: Array<{
          text: string;
          score: number;
          start: number;
          end: number;
          phones: Array<{
            text: string;
            phoneme: string;
            score: number;
            start: number;
            end: number;
          }>;
        }>;
      }>;
    };
    timestamp: number;
  };
}
