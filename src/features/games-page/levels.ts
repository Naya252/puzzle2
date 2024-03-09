import BaseComponent from '@/components/base-component.ts';
import BaseButton from '@/components/base-button/base-button.ts';
import { fetchLevelData } from '@/repository/game-repository.ts';
import store from '@/store/store.ts';

export default class Levels extends BaseComponent {
  private activeLevel: number;

  constructor(collback: (lvl: number) => void) {
    super('div', ['levels']);

    this.activeLevel = 1;

    for (let i = 1; i < 7; i += 1) {
      const levelButton = new BaseButton('button', `Level ${i}`, ['level']);
      levelButton.addListener('click', () => {
        this.activeLevel = i;
        store.game.SET_ACTIVE_LEVEL(i);
        if (!store.game.HAS_LEVEL_DATA(i)) {
          this.fetchLevel(collback);
        } else {
          collback(this.activeLevel);
        }
      });
      this.append(levelButton);
    }

    const el = this.getElement();
    store.game.SET_LEVELS(el.childNodes);
    store.game.SET_ACTIVE_LEVEL(this.activeLevel);
    this.fetchLevel(collback);
  }

  public fetchLevel(collback: (lvl: number) => void): void {
    fetchLevelData(this.activeLevel)
      .then(() => {
        collback(this.activeLevel);
      })
      .catch((error) => {
        throw new Error(`Error fetching level data: ${error}`);
      });
  }
}
