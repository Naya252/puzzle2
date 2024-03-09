export type RoundsData = {
  rounds: { levelData: LevelData; words: Word[] };
  roundsCount: number;
};

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

export class Game {
  private activeLevel: number;
  private levels: NodeListOf<ChildNode> | null;
  private levelsData: Record<number, object | null>;
  private activeGame: { levelData: LevelData; words: Word[] } | null;

  constructor(activeLevel = 1) {
    this.activeLevel = activeLevel;
    this.levels = null;
    this.levelsData = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };

    this.activeGame = null;
  }

  public GET_ACTIVE_LEVEL(): number {
    return this.activeLevel;
  }

  public SET_ACTIVE_LEVEL(num: number): void {
    this.activeLevel = num;
    this.CHANGE_ACTIVE_CLASS(num);
  }

  public SET_LEVELS(levels: NodeListOf<ChildNode>): void {
    this.levels = levels;
  }

  public SET_LEVEL_DATA(data: unknown, id: number): void {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Data is not an object');
    }

    this.levelsData[id] = data;
  }

  public GET_LEVEL_DATA(id: number): object | null {
    const data = this.levelsData[id];
    if (data === null || data === undefined) {
      return null;
    }

    return data;
  }

  public HAS_LEVEL_DATA(id: number): boolean {
    return this.levelsData[id] !== null;
  }

  public GET_ACTIVE_GAME(): { levelData: LevelData; words: Word[] } {
    if (this.activeGame === null) {
      throw new Error('Game is null');
    }
    return this.activeGame;
  }

  public SET_ACTIVE_GAME(game: { levelData: LevelData; words: Word[] }): void {
    this.activeGame = game;
  }

  public CHANGE_ACTIVE_CLASS(num: number): void {
    this.levels?.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.classList.remove('active');

        if (typeof el.textContent === 'string' && el.textContent?.includes(num.toString())) {
          el.classList.add('active');
        }
      }
    });
  }
}
