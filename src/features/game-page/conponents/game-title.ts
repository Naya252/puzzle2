import '@/features/game-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import store from '@/store/store';

export default class GameTitle extends BaseComponent {
  private readonly level: BaseComponent;
  private readonly name: BaseComponent;

  constructor() {
    super('div', ['info'], {});

    this.level = new BaseComponent('h1', ['lvl']);
    this.name = new BaseComponent('h2', ['name']);

    this.append(this.level, this.name);
  }

  public changeLevel(): void {
    const lvl = store.game.getActiveLevel();
    this.level.setTextContent(`Level ${lvl + 1}:`);
  }

  public changeName(name: string): void {
    this.name.setTextContent(`${name}`);
  }
}
