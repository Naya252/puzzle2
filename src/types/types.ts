export type NumLevel = 1 | 2 | 3 | 4 | 5 | 6;

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
};

export type UserType = {
  name: string;
  surname: string;
};
