import React from 'react';
import { Typography } from 'antd';
import { getScoreColor } from '../utils/scoreProcessing';

interface Phone {
  text: string;
  phoneme: string;
  score: number | null;
  start: number;
  end: number;
}

interface Syllable {
  text: string;
  score: number | null;
  start: number;
  end: number;
  phones: Phone[];
}

interface Word {
  text: string;
  score: number | null;
  start: number;
  end: number;
  syllables: Syllable[];
}

interface Sentence {
  text: string;
  score: number;
  words: Word[];
}

interface ScoredTextProps {
  sentence: Sentence;
}

const { Text } = Typography;

const RenderSyllable: React.FC<{ syllable: Syllable; isFirstInWord: boolean }> = ({ syllable, isFirstInWord }) => {
  // Use syllable score if available, otherwise calculate from phones
  let score = syllable.score;
  if (score === null && syllable.phones.length > 0) {
    const validPhones = syllable.phones.filter((phone) => phone.score !== null);
    if (validPhones.length > 0) {
      const avgScore = validPhones.reduce((sum, phone) => sum + (phone.score || 0), 0) / validPhones.length;
      score = Math.round(avgScore);
    }
  }

  const debugInfo = `Score: ${score !== null ? Math.round(score) : 'N/A'} | Raw: ${syllable.score}`;

  // Capitalize if it's the first syllable of the first word
  const displayText = isFirstInWord ? syllable.text.charAt(0).toUpperCase() + syllable.text.slice(1) : syllable.text;

  return (
    <Text
      type={getScoreColor(score) as 'success' | 'warning' | 'danger' | undefined}
      title={debugInfo}
    >
      {displayText}
    </Text>
  );
};

const RenderWord: React.FC<{ word: Word; isFirstWord: boolean }> = ({ word, isFirstWord }) => {
  if (!word.syllables || word.syllables.length === 0) {
    const displayText = isFirstWord ? word.text.charAt(0).toUpperCase() + word.text.slice(1) : word.text;

    return (
      <Text
        type={getScoreColor(word.score) as 'success' | 'warning' | 'danger' | undefined}
        title={`Score: ${word.score !== null ? word.score : 'N/A'}`}
      >
        {displayText}
      </Text>
    );
  }

  return (
    <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
      {word.syllables.map((syllable, index) => (
        <React.Fragment key={`syllable-${index}-${syllable.start}`}>
          <span style={{ display: 'inline-block' }}>
            <RenderSyllable
              syllable={syllable}
              isFirstInWord={isFirstWord && index === 0}
            />
          </span>
          {index < word.syllables.length - 1 && <span style={{ margin: '0 2px' }}>-</span>}
        </React.Fragment>
      ))}
    </span>
  );
};

export const ScoredText: React.FC<ScoredTextProps> = ({ sentence }) => {
  return (
    <div
      style={{
        fontSize: '1.125rem',
        lineHeight: '1.75',
        margin: 0,
        padding: '1em',
        backgroundColor: 'white',
        borderRadius: '0.5em',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
    >
      {sentence.words.map((word, index) => (
        <React.Fragment key={`word-${index}-${word.start}`}>
          <span style={{ display: 'inline-block', marginRight: '0.35em' }}>
            <RenderWord
              word={word}
              isFirstWord={index === 0}
            />
          </span>
          {index < sentence.words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ScoredText;
