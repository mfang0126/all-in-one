import { TypingResult, ScoreQuality } from '../types/score';

interface ColorScore {
  excellent: number;
  good: number;
  poor: number;
}

export interface ColoredTextSegment {
  text: string;
  quality: ScoreQuality;
  start: number;
  end: number;
}

export const SCORE_THRESHOLDS: ColorScore = {
  excellent: 80, // >= 80 is excellent (green)
  good: 60, // >= 60 is good (yellow)
  poor: 0 // < 60 is poor (red)
};

export const getScoreColor = (score: number | null): string => {
  if (score === null) return 'secondary'; // Default color for null scores
  if (score >= SCORE_THRESHOLDS.excellent) return 'success';
  if (score >= SCORE_THRESHOLDS.good) return 'warning';
  return 'danger';
};

export const processScoreResult = (result: TypingResult) => {
  const { calculatedScores, category, timestamp, assessment } = result;
  const { sentence } = assessment;

  const textSegments: ColoredTextSegment[] = [];

  sentence.words.forEach((word) => {
    word.syllables.forEach((syllable) => {
      let syllableQuality: ScoreQuality = 'poor';

      if (syllable.score !== undefined) {
        syllableQuality = syllable.score === 100 ? 'excellent' : syllable.score >= 60 ? 'good' : 'poor';
      } else {
        syllable.phones.forEach((phone) => {
          if (phone.score !== undefined) {
            syllableQuality = phone.score === 100 ? 'excellent' : phone.score >= 60 ? 'good' : 'poor';
          }
        });
      }

      textSegments.push({
        text: syllable.text,
        quality: syllableQuality,
        start: syllable.start,
        end: syllable.end
      });
    });

    if (word !== sentence.words[sentence.words.length - 1]) {
      textSegments.push({
        text: ' ',
        quality: 'good',
        start: word.end,
        end: word.end
      });
    }
  });

  return {
    scoreInfo: {
      calculatedScores,
      category,
      timestamp
    },
    coloredSegments: textSegments
  };
};
