import BaseComponent from '@/components/base-component';
import LoginForm from '@/features/login-page/login-form/form';

class LoginPage extends BaseComponent {
  constructor(fn: (route: string, isAuth: boolean) => void) {
    super('div', ['login-card'], {});
    const loginForm = new LoginForm(fn);
    this.append(loginForm);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new LoginPage(fn);
  return page;
};

export default createPage;
