export type ScoreQuality = 'excellent' | 'good' | 'poor';
export interface BaseScore {
  confidence: string;
  calculatedScore: number;
  normalizedScore: number;
}

export interface StandardScore extends BaseScore {
  type: 'standard';
}

export interface DetailedScore extends BaseScore {
  type: 'detailed';
  contentsScore: number;
  pronunciationScore: number;
  fluencyScore: number;
}

export type ScoreSchema = StandardScore | DetailedScore;

export interface TypingResult {
  uid: string;
  scores: {
    [key: string]: ScoreSchema;
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
