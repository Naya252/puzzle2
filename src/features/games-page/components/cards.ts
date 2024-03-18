import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import store from '@/store/store';
import { type Round } from '@/types/types';
import { IMG_URL } from '@/shared/constants';
import { isNumLevel, isUndefined } from '@/utils/common-validator';

const loadImg = (node: BaseButton, url: string): void => {
  const element = node.getElement();
  const tempImage = new Image();
  tempImage.onload = () => {
    element.style.backgroundImage = `url(${url})`;
    element.style.background = `#dee2e6 center / cover no-repeat url(${url})`;
    node.removeClasses(['loader']);
  };
  tempImage.src = url;
};

const scrollToActive = (element: BaseButton | undefined): void => {
  if (!isUndefined(element)) {
    setTimeout(() => {
      const active = element.getElement();
      active.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }
};

const loadImg = (node: BaseButton, url: string): void => {
  const element = node.getElement();
  const tempImage = new Image();
  tempImage.onload = () => {
    element.style.backgroundImage = `url(${url})`;
    element.style.background = `#dee2e6 center / cover no-repeat url(${url})`;
    node.removeClasses(['loader']);
  };
  tempImage.src = url;
};

export default class Cards extends BaseComponent {
  private readonly cb: VoidFunction;

  constructor(callback: () => void) {
    super('div', ['cards', 'row']);
    this.cb = callback;
  }

  public addHandler(el: Round, card: BaseComponent): void {
    card.addListener('click', () => {
      const activeGame = store.game.getActiveGame();

      if (activeGame.levelData.id !== el.levelData.id) {
        store.game.setActiveGame(el);
        const { id } = el.levelData;
        const activeLvl = id.split('_');

        const Lvlid = Number(activeLvl[0]) - 1;
        const roundid = Number(activeLvl[1]) - 1;

        if (isNumLevel(Lvlid)) {
          store.game.setActiveLevel(Lvlid);
          store.game.setActiveRound(roundid);
          store.game.setActiveSentence(0);
        }
      }
      this.cb();
    });
  }

  public drawCards(activeLevel = 1): void {
    const children: BaseComponent[] = [];
    const data = store.game.getLevelData(activeLevel);
    let active;
    if (data === null) {
      throw new Error('null');
    }
    if ('rounds' in data) {
      const { rounds } = data;
      if (rounds instanceof Array) {
        const completedRounds = store.game.getCompletedRounds();
        const activeGame = store.game.getActiveGame();

        rounds.forEach((el: Round) => {
          const col = new BaseComponent('div', ['col', 'col-6', 'col-lg-4', 'col-xl-3']);

          const card = new BaseButton('button', ``, ['game-card', 'loader']);
          const url = `${IMG_URL}${el.levelData.cutSrc}`;
          loadImg(card, url);
          if (completedRounds.includes(el.levelData.id)) {
            card.setClasses(['completed']);
          }
          if (activeGame.levelData.id === el.levelData.id) {
            card.setClasses(['active-game']);
            active = card;
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
    scrollToActive(active);
  }
}
