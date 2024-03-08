import BaseComponent from '@/components/base-component.ts';
import store from '@/store/store.ts';

class AuthPage extends BaseComponent {
  constructor(fn: (route: string, isAuth: boolean) => void) {
    super('div', [], {}, 'Auth');

    const user = store.user.GET_USER();
    const userInfo = new BaseComponent('div', ['login-card'], {}, `${user.name}  ${user.surname}`);

    this.append(userInfo);
    console.log(fn);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new AuthPage(fn);
  return page;
};

export default createPage;
