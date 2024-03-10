import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import { type NumLevel } from '@/types/types';
import store from '@/store/store';
import { getLevel } from './services/game-service';

export default class Levels extends BaseComponent {
  private activeLevel: NumLevel;

  constructor(callback: (lvl: NumLevel) => void) {
    super('div', ['levels']);

    this.activeLevel = store.game.getActiveLevel();

    for (let i: NumLevel = 1; i < 7; i += 1) {
      const levelButton = new BaseButton('button', `Level ${i}`, ['level']);
      levelButton.addListener('click', () => {
        this.activeLevel = i;
        store.game.setActiveLevel(i);
        if (!store.game.hasLevelData(i)) {
          this.fetchLevel(callback);
        } else {
          callback(this.activeLevel);
        }
      });
      this.append(levelButton);
    }

    const el = this.getElement();
    store.game.setLevels(el.childNodes);
    store.game.changeActiveClass(this.activeLevel);
  }

  public fetchLevel(callback: (lvl: NumLevel) => void): void {
    getLevel(this.activeLevel)
      .then(() => {
        callback(this.activeLevel);
      })
      .catch(() => {
        throw new Error(`error of fetch`);
      });
  }
}
