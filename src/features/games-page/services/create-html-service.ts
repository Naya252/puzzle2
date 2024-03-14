import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { type Round } from '@/types/types';
import { isHTMLElement, isNull, isUndefined } from '@/utils/common-validator';

export const createGameInfo = (data: Round): BaseComponent => {
  const gameInfo = new BaseComponent('div', ['info'], {});
  const lvl = new BaseComponent('h1', ['lvl'], {}, `Level ${store.game.getActiveLevel() + 1}:`);
  const name = new BaseComponent('h2', ['name'], {}, `${data.levelData.name}`);
  gameInfo.append(lvl);
  gameInfo.append(name);
  return gameInfo;
};

export const changeTitle = (gameInfo: BaseComponent, data: Round): void => {
  const el = gameInfo.getElement();
  const lvl = el.childNodes[0];
  const title = el.childNodes[1];
  if (!isNull(title) && !isUndefined(title)) {
    title.textContent = `${data.levelData.name}`;
  }
  if (!isNull(lvl) && !isUndefined(lvl)) {
    lvl.textContent = `Level ${store.game.getActiveLevel() + 1}:`;
  }
};

export const createHints = (): BaseComponent => {
  const hints = new BaseComponent('div', ['hints'], {}, 'hints');
  return hints;
};

export const createText = (): BaseComponent => {
  const text = new BaseComponent('p', ['text'], {}, 'text');
  return text;
};

export const createGameWrapper = (): BaseComponent => {
  const wrapper = new BaseComponent('div', ['game-wrapper']);
  return wrapper;
};

export const creatGameField = (url: string): BaseComponent => {
  const gameField = new BaseComponent('div', ['game-field']);
  const game = gameField.getElement();

  game.style.background = `#464849 center / contain no-repeat url(${url})`;

  let i = 0;
  while (i < 10) {
    const row = new BaseComponent('div', ['row', 'row-img'], { id: `row-${i}` });
    i += 1;
    gameField.append(row);
  }

  return gameField;
};

export const changeGamefield = (url: string, gameField: BaseComponent): void => {
  const game = gameField.getElement();
  game.style.background = `#464849 center / contain no-repeat url(${url})`;

  const childs = Array.from(game.childNodes);
  childs.forEach((el) => {
    if (isHTMLElement(el)) {
      const copy = el;
      copy.innerHTML = '';
    }
  });
};
