import BaseComponent from '@/components/base-component.ts';
import VideoLayer from '@/features/video-layer/video-layer.ts';
import LoginForm from '@/features/login-form/form.ts';

class LoginPage extends BaseComponent {
  constructor() {
    super('div', ['layout-content'], {});

    const videoLayer = new VideoLayer();
    const loginForm = new LoginForm();

    const content = new BaseComponent('div', ['login-card'], {});
    content.append(loginForm);
    this.append(videoLayer, content);
  }
}

const createPage = (): BaseComponent => {
  const page = new LoginPage();
  return page;
};

export default createPage;
