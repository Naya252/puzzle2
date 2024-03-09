import '@/styles/core.scss';
import BaseComponent from '@/components/base-component.ts';
import { videoLayer } from '@/features/video-layer/video-layer.ts';
import HeaderComponent from '@/features/header/header-component.ts';
import FooterComponent from '@/features/footer/footer-component.ts';

import AppRouter from '@/router/router.ts';
import { ROUTES } from '@/router/pathes.ts';

import store from '@/store/store.ts';
import { getUser, removeUser } from '@/repository/login-repository.ts';

export default class App {
  private readonly appContainer: BaseComponent;
  private readonly router: AppRouter;
  private readonly header: HeaderComponent;

  constructor() {
    this.appContainer = new BaseComponent('div', ['app']);

    this.header = new HeaderComponent();
    const content = new BaseComponent('div', ['content', 'container']);
    const footer = new FooterComponent();

    this.header.appendLinks(...this.createLinks());
    this.appContainer.append(videoLayer, this.header, content, footer);
    this.router = new AppRouter(content, () => {
      this.header.changeHeader();
    });
  }

  public init(): void {
    const { body } = document;
    body.setAttribute('data-bs-theme', 'dark');
    this.appContainer.appendToParent(body);

    const user = getUser();
    store.user.SET_USER(user);

    this.router.push(ROUTES.Start, store.user.HAS_USER());
  }

  protected destroy(): void {
    this.appContainer.remove();
    this.router.destroy();
  }

  private createLinks(): HTMLElement[] {
    return Object.entries(ROUTES).map(([name, route]) => {
      const link = new BaseComponent('a', ['nav-link'], { id: route, href: route }, name === 'Login' ? 'Logout' : name);

      link.addListener('click', (event) => {
        event.preventDefault();
        this.router.push(route, store.user.HAS_USER());

        const el = link.getElement();

        if (el.id === 'login') {
          removeUser();
          this.router.push('login', store.user.HAS_USER());
        }
      });

      return link.getElement();
    });
  }
}
