import BaseComponent from '@/components/base-component.ts';
// import BaseButton from '@/components/base-button/base-button.ts';
import store from '@/store/store.ts';
// import { ROUTES } from '@/router/pathes.ts';
import '@/features/start-page/start.scss';

class GamePage extends BaseComponent {
  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    const user = store.user.GET_USER();
    super('div', [], {}, user.name);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamePage(fn);
  return page;
};

export default createPage;
