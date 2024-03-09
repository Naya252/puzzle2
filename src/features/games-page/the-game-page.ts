import BaseComponent from '@/components/base-component.ts';
import '@/features/games-page/games-page.scss';

class GamePage extends BaseComponent {
  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['game'], {});
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamePage(fn);
  return page;
};

export default createPage;
