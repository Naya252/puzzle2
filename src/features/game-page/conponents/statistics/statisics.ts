import '@/features/game-page/conponents/statistics/statistic.scss';
import '@/features/game-page/conponents/hints/hints.scss';
import '@/features/game-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import { type GameFullData } from '@/types/types';
import { BASE_DATA_URL } from '@/shared/constants';
import Light from '@/assets/icons/lightbulb-on-10.svg';
import LightAlert from '@/assets/icons/lightbulb-alert-outline.svg';
import AudioBtn from '../hints/audioBtn';

const createItem = (item: GameFullData): BaseComponent => {
  const sentenceItem = new BaseComponent('div', ['sentence']);
  const text = new BaseComponent('p', ['text'], {}, item.levelData.textExample);
  const audio = new AudioBtn(`${BASE_DATA_URL}${item.levelData.audioExample}`);
  sentenceItem.append(audio, text);
  return sentenceItem;
};

const createTitle = (title: string, icon: string, length: number): BaseComponent => {
  const titleItem = new BaseComponent('div', ['title-statistic']);
  const img = new BaseComponent('img', ['icon'], { alt: '', src: icon });
  const statisticsTitle = new BaseComponent('h3', ['result-title'], {}, title);
  const badge = new BaseComponent('div', ['badge'], {}, `${length}`);
  titleItem.append(img, statisticsTitle, badge);
  return titleItem;
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

    this.know = new BaseComponent('div', ['result-block', 'know']);
    this.dontKnow = new BaseComponent('div', ['result-block']);

    this.append(this.know, this.dontKnow);
  }

  public fillKnow(items: GameFullData[]): void {
    const title = createTitle('I know', Light, items.length);
    const sentences = new BaseComponent('div', ['sentences']);
    this.know.append(title, sentences);

    if (items.length > 0) {
      items.forEach((el) => {
        const item = createItem(el);
        sentences.append(item);
      });
    } else {
      const text = createEmptyText('Try to play this round again');
      sentences.append(text);
    }
  }

  public fillDotKnow(items: GameFullData[]): void {
    const title = createTitle(`I dont't know`, LightAlert, items.length);
    const sentences = new BaseComponent('div', ['sentences']);
    this.dontKnow.append(title, sentences);

    if (items.length > 0) {
      items.forEach((el) => {
        const item = createItem(el);
        sentences.append(item);
      });
    } else {
      const text = createEmptyText('Exellent! You know all sentences');
      sentences.append(text);
    }
  }

  public cleanStatistic(): void {
    this.know.setHTML('');
    this.dontKnow.setHTML('');
  }
}
