import { type RoundsData, type Round, type NumLevel } from '@/types/types';

export default class Game {
  private activeLevel: NumLevel;
  private levels: NodeListOf<ChildNode> | null;
  private levelsData: Record<PropertyKey, RoundsData | null>;
  private activeGame: Round | null;

  constructor(activeLevel: NumLevel = 1) {
    this.activeLevel = activeLevel;
    this.levels = null;
    this.levelsData = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };

    this.activeGame = null;
  }

  public getActiveLevel(): NumLevel {
    return this.activeLevel;
  }

  public setActiveLevel(num: NumLevel): void {
    this.activeLevel = num;
    this.changeActiveClass(num);
  }

  public setLevels(levels: NodeListOf<ChildNode>): void {
    this.levels = levels;
  }

  public setLevelData(data: RoundsData, id: number): void {
    this.levelsData[id] = data;
  }

  public getLevelData(id: number): RoundsData | null {
    const data = this.levelsData[id];

    if (typeof data === 'undefined') {
      return null;
    }

    return data;
  }

  public hasLevelData(id: number): boolean {
    return this.levelsData[id] !== null;
  }

  public getActiveGame(): Round {
    if (this.activeGame === null) {
      throw new Error('Game is null');
    }
    return this.activeGame;
  }

  public setActiveGame(game: Round): void {
    this.activeGame = game;
  }

  public changeActiveClass(num: NumLevel): void {
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
