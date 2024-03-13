import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import store from '@/store/store';
import { type Round } from '@/types/types';
import { IMG_URL } from '@/shared/constants';

export default class Cards extends BaseComponent {
  private readonly cb: VoidFunction;

  constructor(callback: () => void) {
    super('div', ['cards', 'row']);
    this.cb = callback;
  }

  public drawCards(activeLevel = 1): void {
    const children: BaseComponent[] = [];
    const data = store.game.getLevelData(activeLevel);
    if (data === null) {
      throw new Error('null');
    }

    if ('rounds' in data) {
      const { rounds } = data;
      if (rounds instanceof Array) {
        rounds.forEach((el: Round) => {
          const col = new BaseComponent('div', ['col', 'col-6', 'col-lg-4', 'col-xl-3']);

          const card = new BaseButton('button', ``, ['game-card']);
          const elCard = card.getElement();
          const url = `${IMG_URL}${el.levelData.cutSrc}`;
          elCard.style.background = `#464849 center / cover no-repeat url(${url})`;

          const name = new BaseComponent('p', ['name-img'], {}, el.levelData.name);
          const back = new BaseComponent('div', ['dark-layer']);

          card.addListener('click', () => {
            store.game.setActiveGame(el);
            this.cb();
          });

          card.append(back, name);

          col.append(card);
          children.push(col);
        });
      }
    }

    this.replaceChildren(...children);
  }
}
