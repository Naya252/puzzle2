import '@/features/game-page/game-page.scss';
import BaseComponent from '@/components/base-component';

export default class WordsContainer extends BaseComponent {
  constructor() {
    super('div', ['words-container']);
  }

  public clean(): void {
    this.setHTML('');
  }
}
