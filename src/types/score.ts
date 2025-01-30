export type ScoreQuality = 'excellent' | 'good' | 'poor';

export type Confidence = 'low' | 'medium' | 'high';

export enum ScoreType {
  Basic = 'basic',
  Advanced = 'advanced'
}

export interface BaseScore {
  confidence: Confidence;
  calculated: number;
  normalized: number;
}

export interface BasicScore extends BaseScore {
  type: ScoreType.Basic;
}

export interface AdvancedScore extends BaseScore {
  type: ScoreType.Advanced;
  contents: number;
  pronunciation: number;
  fluency: number;
}

export type ScoreSchema = BasicScore | AdvancedScore;

export interface TypingResult {
  uid: string;
  originalFilename: string;
  score: {
    standard: number;
    accuracy: number;
    fluency: number;
    integrity: number;
    total: number;
  };
  calculatedScore: Array<{
    type: ScoreType;
    calculated: number;
    normalized: number;
    confidence: Confidence;
    content?: number;
    pronunciation?: number;
    fluency?: number;
  }>;
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
