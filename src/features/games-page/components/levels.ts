import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import { type NumLevel } from '@/types/types';
import store from '@/store/store';
import { getLevel } from '../../game-page/services/game-service';

export default class Levels extends BaseComponent {
  private activeLevel: NumLevel;
  private readonly levels: BaseButton[];

  constructor(callback: (lvl: NumLevel) => void) {
    super('div', ['levels']);

    this.activeLevel = store.game.getActiveLevel();
    this.levels = [];

    for (let i: NumLevel = 0; i < 6; i += 1) {
      const levelButton = new BaseButton('button', `Level ${i + 1}`, ['level']);
      this.levels.push(levelButton);

      levelButton.addListener('click', () => {
        this.activeLevel = i;
        if (!store.game.hasLevelData(i)) {
          this.fetchLevel(callback);
        } else {
          callback(this.activeLevel);
        }

        const el = this.getElement();
        store.game.setLevels(el.childNodes);
        store.game.changeActiveClass(this.activeLevel);
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

  public changeCompletedLevel(): void {
    const completedLevels = store.game.getCompletedLevels();

    this.levels.forEach((el, i) => {
      if (completedLevels.some((lvl) => lvl === i)) {
        el.setClasses(['completed-level']);
      }
    });
  }
}
