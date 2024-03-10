import type { RoundsData, Round, LevelData, Word } from '@/types/types';

const isLevelData = (value: unknown): value is LevelData => {
  const fields = ['id', 'name', 'imageSrc', 'cutSrc', 'author', 'year'];

  if (
    value !== null &&
    typeof value === 'object' &&
    fields.every((field) => field in value) &&
    Object.values(value).every((val) => typeof val === 'string')
  ) {
    return true;
  }

  return false;
};

const isWord = (value: unknown): value is Word => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'audioExample' in value &&
    typeof value.audioExample === 'string' &&
    'textExample' in value &&
    typeof value.textExample === 'string' &&
    'textExampleTranslate' in value &&
    typeof value.textExampleTranslate === 'string' &&
    'id' in value &&
    typeof value.id === 'number' &&
    'word' in value &&
    typeof value.word === 'string' &&
    'wordTranslate' in value &&
    typeof value.wordTranslate === 'string'
  ) {
    return true;
  }

  return false;
};

const isRound = (value: unknown): value is Round => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'levelData' in value &&
    isLevelData(value.levelData) &&
    'words' in value &&
    Array.isArray(value.words) &&
    value.words.every((word) => isWord(word))
  ) {
    return true;
  }

  return false;
};

export const isRoundsData = (value: unknown): value is RoundsData => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'rounds' in value &&
    Array.isArray(value.rounds) &&
    value.rounds.every((round) => isRound(round)) &&
    'roundsCount' in value &&
    typeof value.roundsCount === 'number'
  ) {
    return true;
  }

  return false;
};

export default isRoundsData;
