import '@/features/game-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import { isHTMLElement, isUndefined } from '@/utils/common-validator';
import { type NumSentence } from '@/types/types';

export default class GameField extends BaseComponent {
  constructor() {
    super('div', ['game-field']);

    const rows = 10;
    let i = 0;
    while (i < rows) {
      const row = new BaseComponent('div', ['row', 'row-img'], { id: `row-${i}` });
      this.append(row);
      i += 1;
    }
  }

  public changeImage(url: string): void {
    const game = this.getElement();
    game.style.background = `#464849 center / contain no-repeat url(${url})`;
  }

  public clean(): void {
    const game = this.getElement();
    const childs = Array.from(game.childNodes);
    childs.forEach((el) => {
      if (isHTMLElement(el)) {
        const copy = el;
        copy.innerHTML = '';
      }
    });
  }

  public selectRow(i: NumSentence): ChildNode {
    const game = this.getElement();
    const el = game.childNodes[i];
    if (isUndefined(el)) {
      throw new Error('is undefined');
    }
    return el;
  }
}
