import '@/features/game-page/conponents/statistics/statistic.scss';
import BaseComponent from '@/components/base-component';
import { type GameFullData } from '@/types/types';

const createItem = (item: GameFullData): BaseComponent => {
  const sentenceItem = new BaseComponent('div', ['sentence'], {}, item.levelData.textExample);
  return sentenceItem;
};

const createTitle = (title: string): BaseComponent => {
  const statisticsTitle = new BaseComponent('h3', ['result-title'], {}, title);
  return statisticsTitle;
};

const createEmptyText = (text: string): BaseComponent => {
  const emptyText = new BaseComponent('p', ['empty-text'], {}, text);
  return emptyText;
};

export default class Statistics extends BaseComponent {
  private readonly know: BaseComponent;
  private readonly dontKnow: BaseComponent;

  constructor() {
    super('div', ['result', 'hide']);

    this.know = new BaseComponent('div', ['result-block']);
    this.dontKnow = new BaseComponent('div', ['result-block']);

    this.append(this.know, this.dontKnow);
  }

  public fillKnow(items: GameFullData[]): void {
    const title = createTitle('I know');
    this.know.append(title);

    if (items.length > 0) {
      items.forEach((el) => {
        const item = createItem(el);
        this.know.append(item);
      });
    } else {
      const text = createEmptyText('Try to play this round again');
      this.know.append(text);
    }
  }

  public fillDotKnow(items: GameFullData[]): void {
    const title = createTitle(`I dont't know`);
    this.dontKnow.append(title);

    if (items.length > 0) {
      items.forEach((el) => {
        const item = createItem(el);
        this.dontKnow.append(item);
      });
    } else {
      const text = createEmptyText('Exellent! You know all sentences');
      this.dontKnow.append(text);
    }
  }

  public cleanStatistic(): void {
    this.know.setHTML('');
    this.dontKnow.setHTML('');
  }
}
