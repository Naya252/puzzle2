import Router, { type Route } from '@/lib/router';
import { ROUTES } from '@/router/pathes';
import type BaseComponent from '@/components/base-component';
import store from '@/store/store';

export default class AppRouter extends Router {
  public routerOutlet: BaseComponent;
  public changeHeader: VoidFunction;

  // eslint-disable-next-line max-lines-per-function
  constructor(routerOutlet: BaseComponent, fn: VoidFunction) {
    super(
      [
        {
          name: ROUTES.Login,
          component: async () => {
            const { default: createPage } = await import('@/features/login-page/login-page');
            return createPage((route: string, isAuth: boolean) => {
              this.push(route, isAuth);
            });
          },
        },
        {
          name: ROUTES.Start,
          component: async () => {
            const { default: createPage } = await import('@/features/start-page/start-page');
            return createPage((route: string, isAuth: boolean) => {
              this.push(route, isAuth);
            });
          },
        },
        {
          name: ROUTES.Games,
          component: async () => {
            const { default: createPage } = await import('@/features/games-page/games-page');
            return createPage((route: string, isAuth: boolean) => {
              this.push(route, isAuth);
            });
          },
        },
        {
          name: ROUTES.Game,
          component: async () => {
            const { default: createPage } = await import('@/features/game-page/the-game-page');
            return createPage((route: string, isAuth: boolean) => {
              this.push(route, isAuth);
            });
          },
        },
      ],
      async (route: Route) => {
        const component = await route.component();
        routerOutlet.replaceChildren(component);
      },
      async () => {
        const { default: createPage } = await import('@/features/404-page');
        return createPage();
      },
    );

    this.routerOutlet = routerOutlet;
    this.changeHeader = fn;
  }

  public push(route = '', isAuth = false): void {
    this.changeHeader();
    let newRoute = route;

    if (newRoute === '') {
      newRoute = window.location.pathname.slice(1);

      if (!isAuth) {
        newRoute = 'login';
      }

      if (newRoute === '') {
        newRoute = 'start';
      }
    }

    super.navigateTo(newRoute);
  }

  public logout(): void {
    this.push('login', store.user.hasUser());
  }
}
