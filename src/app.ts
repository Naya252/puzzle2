import '@/styles/core.scss';
import BaseComponent from '@/components/base-component.ts';
import HeaderComponent from '@/features/header/header-component.ts';
import FooterComponent from '@/features/footer/footer-component.ts';

import type Router from '@/lib/router.ts';
import createRouter from '@/router/router.ts';
import { ROUTES } from '@/router/pathes.ts';

import store from '@/store/store.ts';
import { getUser } from '@/repository/login-repository.ts';

export default class App {
  private readonly appContainer: BaseComponent;
  private readonly router: Router;

  constructor() {
    this.appContainer = new BaseComponent('div', ['app']);

    const header = new HeaderComponent();
    const content = new BaseComponent('div', ['content', 'container']);
    const footer = new FooterComponent();

    header.appendLinks(...this.createLinks());
    this.appContainer.append(header, content, footer);
    this.router = createRouter(content);
  }

  public init(): void {
    const { body } = document;
    body.setAttribute('data-bs-theme', 'dark');
    this.appContainer.appendToParent(body);

    const user = getUser();
    store.user.SET_USER(user);
  }

  protected destroy(): void {
    this.appContainer.remove();
    this.router.destroy();
  }

  private createLinks(): HTMLAnchorElement[] {
    return Object.entries(ROUTES).map(([name, route]) => {
      const link = document.createElement('a');
      link.href = route;
      link.textContent = name;

      link.onclick = (event) => {
        event.preventDefault();
        this.router.navigateTo(route);
      };

      return link;
    });
  }
}
