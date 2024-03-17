import Router, { type Route } from '@/lib/router';
import { ROUTES } from '@/router/pathes';
import type BaseComponent from '@/components/base-component';
import store from '@/store/store';

export default class AppRouter extends Router {
  public routerOutlet: BaseComponent;
  public changeHeader: VoidFunction;

  constructor(routerOutlet: BaseComponent, onChangeHeader: VoidFunction) {
    super(
      [
        { name: ROUTES.Login, module: import('@/features/login-page/login-page') },
        { name: ROUTES.Start, module: import('@/features/start-page/start-page') },
        { name: ROUTES.Games, module: import('@/features/games-page/games-page') },
        { name: ROUTES.Game, module: import('@/features/game-page/the-game-page') },
      ].map(({ name, module }) => ({
        name,
        component: async () => {
          const { default: createPage } = await module;
          return createPage((route: string, isAuth: boolean) => {
            this.push(route, isAuth);
          });
        },
      })),

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
    this.changeHeader = onChangeHeader;
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
