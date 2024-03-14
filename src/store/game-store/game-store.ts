import { type RoundsData, type Round, type NumLevel, type NumSentence } from '@/types/types';

export default class Game {
  private activeLevel: NumLevel;
  private activeSentence: NumSentence;
  private levels: NodeListOf<ChildNode> | null;
  private levelsData: Record<PropertyKey, RoundsData | null>;
  private activeGame: Round | null;
  private activeRound: number;
  private links: HTMLElement[];

  constructor(activeLevel: NumLevel = 0, activeRound = 0, activeSentence: NumSentence = 0) {
    this.activeLevel = activeLevel;
    this.activeRound = activeRound;
    this.activeSentence = activeSentence;

    this.levels = null;
    this.levelsData = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null };

    this.activeGame = null;

    this.links = [];
  }

  public getActiveLevel(): NumLevel {
    return this.activeLevel;
  }

  public setActiveLevel(num: NumLevel): void {
    this.activeLevel = num;
    this.changeActiveClass(num);
  }

  public getActiveRound(): number {
    return this.activeRound;
  }

  public setActiveRound(num: number): void {
    this.activeRound = num;
  }

  public getActiveSentence(): NumSentence {
    return this.activeSentence;
  }

  public setActiveSentence(num: NumSentence): void {
    this.activeSentence = num;
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

        if (typeof el.textContent === 'string' && el.textContent?.includes((num + 1).toString())) {
          el.classList.add('active');
        }
      }
    });
  }

  public setLinks(links: HTMLElement[]): void {
    this.links = links;
  }

  public removeActiveLink(): void {
    this.links.forEach((el) => {
      el.classList.remove('active-nav');
    });
  }

  public addActiveLink(id: string): void {
    this.links.forEach((el) => {
      if (el.id === id) {
        el.classList.add('active-nav');
      }
    });
  }
}
