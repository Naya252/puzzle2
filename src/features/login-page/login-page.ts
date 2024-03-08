import BaseComponent from '@/components/base-component.ts';
import { videoLayer } from '@/features/video-layer/video-layer.ts';
import LoginForm from '@/features/login-page/login-form/form.ts';

class LoginPage extends BaseComponent {
  constructor(fn: (route: string, isAuth: boolean) => void) {
    super('div', [], {});

    const loginForm = new LoginForm(fn);

    const content = new BaseComponent('div', ['login-card'], {});
    content.append(loginForm);
    this.append(videoLayer, content);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new LoginPage(fn);
  return page;
};

export default createPage;
