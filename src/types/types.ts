import type BaseComponent from '@/components/base-component';

export type NumLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type NumSentence = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type RoundsData = {
  rounds: Round[];
  roundsCount: number;
};

export type Round = { levelData: LevelData; words: Word[] };

export type LevelData = {
  author: string;
  cutSrc: string;
  id: string;
  imageSrc: string;
  name: string;
  year: string;
};

export type Word = {
  audioExample: string;
  id: number;
  textExample: string;
  textExampleTranslate: string;
  word: string;
  wordTranslate: string;
  isWin?: boolean;
};

export type UserType = {
  name: string;
  surname: string;
};

export type UserSettingsType = {
  isShowTranslate: boolean;
  isShowAudio: boolean;
  isShowImage: boolean;
};

export type GameData = {
  id: string;
  word: string;
  length: number;
  widthPercents: number;
  node: null | BaseComponent;
};

export type GameFullData = { levelData: Word; wordsFullData: GameData[] };
