import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import store from '@/store/store';
import { type Round } from '@/types/types';
import { IMG_URL } from '@/shared/constants';
import { isNumLevel } from '@/utils/common-validator';

export default class Cards extends BaseComponent {
  private readonly cb: VoidFunction;

  constructor(callback: () => void) {
    super('div', ['cards', 'row']);
    this.cb = callback;
  }

  public addHandler(el: Round, card: BaseComponent): void {
    card.addListener('click', () => {
      store.game.setActiveGame(el);
      const { id } = el.levelData;
      const activeLvl = id.split('_');

      const Lvlid = Number(activeLvl[0]) - 1;
      const roundid = Number(activeLvl[1]) - 1;
      if (isNumLevel(Lvlid)) {
        store.game.setActiveLevel(Lvlid);
        store.game.setActiveRound(roundid);
        store.game.setActiveSentence(0);

        this.cb();
      }
    });
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
        const completedRounds = store.game.getCompletedRounds();

        rounds.forEach((el: Round) => {
          const col = new BaseComponent('div', ['col', 'col-6', 'col-lg-4', 'col-xl-3']);

          const card = new BaseButton('button', ``, ['game-card']);
          const elCard = card.getElement();
          const url = `${IMG_URL}${el.levelData.cutSrc}`;
          elCard.style.background = `#464849 center / cover no-repeat url(${url})`;

          if (completedRounds.includes(el.levelData.id)) {
            card.setClasses(['completed']);
          }

          const name = new BaseComponent('p', ['name-img'], {}, el.levelData.name);
          const back = new BaseComponent('div', ['dark-layer']);

          this.addHandler(el, card);
          card.append(back, name);

          col.append(card);
          children.push(col);
        });
      }
    }

    this.replaceChildren(...children);
  }
}
