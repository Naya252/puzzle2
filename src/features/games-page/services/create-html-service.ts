import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { type Round } from '@/types/types';

export const createGameInfo = (data: Round): BaseComponent => {
  const gameInfo = new BaseComponent('div', ['info'], {});
  const lvl = new BaseComponent('h1', ['lvl'], {}, `Level ${store.game.getActiveLevel()}:`);
  const name = new BaseComponent('h2', ['name'], {}, `${data.levelData.name}`);
  gameInfo.append(lvl);
  gameInfo.append(name);
  return gameInfo;
};

export const createHints = (): BaseComponent => {
  const hints = new BaseComponent('div', ['hints'], {}, 'hints');
  return hints;
};

export const creatText = (): BaseComponent => {
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
    i += 1;
    const row = new BaseComponent('div', ['row', 'row-img'], { id: `row-${i}` });
    gameField.append(row);
  }

  return gameField;
};
