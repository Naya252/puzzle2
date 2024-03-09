import BaseComponent from '@/components/base-component.ts';
import Levels from '@/features/games-page/levels.ts';
import Cards from '@/features/games-page/cards.ts';
import '@/features/games-page/games-page.scss';

import { ROUTES } from '@/router/pathes.ts';
import store from '@/store/store.ts';

class GamesPage extends BaseComponent {
  private readonly levels: Levels;
  private readonly cards: Cards;

  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['game'], {});

    this.cards = new Cards(() => {
      console.log(store.game.GET_ACTIVE_GAME());
      pushRouter(ROUTES.Game, store.user.HAS_USER());
    });
    this.levels = new Levels((lvl: number) => {
      this.cards.drawCards(lvl);
    });

    this.append(this.levels, this.cards);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamesPage(fn);
  return page;
};

export default createPage;
