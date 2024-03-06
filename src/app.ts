import '@/styles/core.scss';
import BaseComponent from '@/components/base-component.ts';
import type Router from '@/lib/router.ts';
import createRouter from '@/router/router.ts';
import { ROUTES } from '@/router/pathes.ts';

export default class App {
  private readonly appContainer: BaseComponent;
  private readonly router: Router;

  constructor() {
    this.appContainer = new BaseComponent('div', ['app']);
    const content = new BaseComponent('div', ['content', 'container']);

    this.appContainer.append(...this.createLinks(), content);

    this.router = createRouter(content);
  }

  public init(): void {
    const { body } = document;
    body.setAttribute('data-bs-theme', 'dark');
    this.appContainer.appendToParent(body);
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
