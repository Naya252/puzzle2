import BaseComponent from '@/components/base-component';
import Levels from '@/features/games-page/levels';
import Cards from '@/features/games-page/cards';
import '@/features/games-page/games-page.scss';

import { ROUTES } from '@/router/pathes';
import store from '@/store/store';

import { type NumLevel } from '@/types/types';

class GamesPage extends BaseComponent {
  private readonly levels: Levels;
  private readonly cards: Cards;

  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['games'], {});

    this.cards = new Cards(() => {
      pushRouter(ROUTES.Game, store.user.hasUser());
      store.game.removeActiveLink();
      store.game.addActiveLink(ROUTES.Game);
    });
    this.levels = new Levels((lvl: NumLevel) => {
      this.cards.drawCards(lvl);
    });

    this.append(this.levels, this.cards);
    const activeLevel = store.game.getActiveLevel();
    this.cards.drawCards(activeLevel);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamesPage(fn);
  return page;
};

export default createPage;
