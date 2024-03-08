import BaseComponent from '@/components/base-component.ts';
import store from '@/store/store.ts';

class AuthPage extends BaseComponent {
  constructor() {
    super('div', [], {}, 'Auth');

    const user = store.user.GET_USER();
    const userInfo = new BaseComponent('div', ['login-card'], {}, `${user.name}  ${user.surname}`);

    this.append(userInfo);
  }
}

const createPage = (): BaseComponent => {
  const page = new AuthPage();
  return page;
};

export default createPage;
