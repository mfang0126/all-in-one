export const LANGUAGE_CONFIG = {
  'Global English': {
    label: 'Global English',
    assemblyai: 'en',
    google: 'en-US',
    openai: 'en'
  },
  'Australian English': {
    label: 'Australian English',
    assemblyai: 'en',
    google: 'en-AU',
    openai: 'en'
  },
  'British English': {
    label: 'British English',
    assemblyai: 'en',
    google: 'en-GB',
    openai: 'en'
  },
  'US English': {
    label: 'US English',
    assemblyai: 'en',
    google: 'en-US',
    openai: 'en'
  },
  Spanish: {
    label: 'Spanish',
    assemblyai: 'es',
    google: 'es-ES',
    openai: 'es'
  },
  French: {
    label: 'French',
    assemblyai: 'fr',
    google: 'fr-FR',
    openai: 'fr'
  },
  German: {
    label: 'German',
    assemblyai: 'de',
    google: 'de-DE',
    openai: 'de'
  },
  Italian: {
    label: 'Italian',
    assemblyai: 'it',
    google: 'it-IT',
    openai: 'it'
  },
  Portuguese: {
    label: 'Portuguese',
    assemblyai: 'pt',
    google: 'pt-PT',
    openai: 'pt'
  },
  Dutch: {
    label: 'Dutch',
    assemblyai: 'nl',
    google: 'nl-NL',
    openai: 'nl'
  },
  Hindi: {
    label: 'Hindi',
    assemblyai: 'hi',
    google: 'hi-IN',
    openai: 'hi'
  },
  Japanese: {
    label: 'Japanese',
    assemblyai: 'ja',
    google: 'ja-JP',
    openai: 'ja'
  },
  Chinese: {
    label: 'Chinese',
    assemblyai: 'zh',
    google: 'zh',
    openai: 'zh'
  },
  Finnish: {
    label: 'Finnish',
    assemblyai: 'fi',
    google: 'fi-FI',
    openai: 'fi'
  },
  Korean: {
    label: 'Korean',
    assemblyai: 'ko',
    google: 'ko-KR',
    openai: 'ko'
  },
  Polish: {
    label: 'Polish',
    assemblyai: 'pl',
    google: 'pl-PL',
    openai: 'pl'
  },
  Russian: {
    label: 'Russian',
    assemblyai: 'ru',
    google: 'ru-RU',
    openai: 'ru'
  },
  Turkish: {
    label: 'Turkish',
    assemblyai: 'tr',
    google: 'tr-TR',
    openai: 'tr'
  },
  Ukrainian: {
    label: 'Ukrainian',
    assemblyai: 'uk',
    google: 'uk-UA',
    openai: 'uk'
  },
  Vietnamese: {
    label: 'Vietnamese',
    assemblyai: 'vi',
    google: 'vi-VN',
    openai: 'vi'
  }
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG) as SupportedLanguage[];
