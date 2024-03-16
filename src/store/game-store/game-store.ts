import {
  type RoundsData,
  type Round,
  type NumLevel,
  type NumSentence,
  type UserSettingsType,
  type LastGameData,
} from '@/types/types';

export default class Game {
  private activeLevel: NumLevel;
  private activeSentence: NumSentence;
  private levels: NodeListOf<ChildNode> | null;
  private levelsData: Record<PropertyKey, RoundsData | null>;
  private activeGame: Round | null;
  private activeRound: number;
  private links: HTMLElement[];

  private isShowTranslate: boolean;
  private isShowAudio: boolean;
  private isShowImage: boolean;
  private completedRounds: string[];
  private completedLevels: number[];
  private winData: boolean[];

  constructor(activeLevel: NumLevel = 0, activeRound = 0, activeSentence: NumSentence = 0) {
    this.activeLevel = activeLevel;
    this.activeRound = activeRound;
    this.activeSentence = activeSentence;

    this.levels = null;
    this.levelsData = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null };

    this.activeGame = null;

    this.links = [];

    this.isShowTranslate = true;
    this.isShowAudio = true;
    this.isShowImage = true;
    this.completedRounds = [];
    this.completedLevels = [];
    this.winData = [];
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

  public getIsShowTranslate(): boolean {
    return this.isShowTranslate;
  }

  public getIsShowAudio(): boolean {
    return this.isShowAudio;
  }

  public getIsShowImage(): boolean {
    return this.isShowImage;
  }

  public setIsShowTranslate(isShow: boolean): void {
    this.isShowTranslate = isShow;
  }

  public setIsShowAudio(isShow: boolean): void {
    this.isShowAudio = isShow;
  }

  public setIsShowImage(isShow: boolean): void {
    this.isShowImage = isShow;
  }

  public getHintSettings(): UserSettingsType {
    return {
      isShowTranslate: this.isShowTranslate,
      isShowAudio: this.isShowAudio,
      isShowImage: this.isShowImage,
    };
  }

  public getCompletedRounds(): string[] {
    return this.completedRounds;
  }

  public setCompletedRounds(round: string): void {
    this.completedRounds.push(round);
  }

  public changeCompletedRounds(rounds: string[]): void {
    this.completedRounds = rounds;
  }

  public getCompletedLevels(): number[] {
    return this.completedLevels;
  }

  public setCompletedLevels(numLevel: number): void {
    this.completedLevels.push(numLevel);
  }

  public changeCompletedLevels(levels: number[]): void {
    this.completedLevels = levels;
  }

  public getGameDataForSaveGame(): LastGameData {
    const data = {
      level: this.activeLevel,
      round: this.activeRound,
      sentence: this.activeSentence,
      winData: this.winData,
    };
    return data;
  }

  public getWinData(): boolean[] {
    return this.winData;
  }

  public setWinData(isWin: boolean): void {
    this.winData.push(isWin);
  }

  public changeWinData(winData: boolean[]): void {
    this.winData = winData;
  }
}
