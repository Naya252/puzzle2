import Router, { type Route } from '@/lib/router.ts';
import { ROUTES } from '@/router/pathes.ts';
import type BaseComponent from '@/components/base-component.ts';

export default class AppRouter extends Router {
  public routerOutlet: BaseComponent;
  public changeHeader: VoidFunction;

  constructor(routerOutlet: BaseComponent, fn: VoidFunction) {
    super(
      [
        {
          name: ROUTES.Login,
          component: async () => {
            const { default: createPage } = await import('@/features/login-page/login-page.ts');
            return createPage((route: string, isAuth: boolean) => {
              this.push(route, isAuth);
            });
          },
        },
        {
          name: ROUTES.Start,
          component: async () => {
            const { default: createPage } = await import('@/features/start-page/start-page.ts');
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
        const { default: createPage } = await import('@/features/404-page.ts');
        return createPage();
      },
    );

    this.routerOutlet = routerOutlet;
    this.changeHeader = fn;
  }

  public push(route: string, isAuth: boolean): void {
    const isSave = false;

    this.changeHeader();

    if (isAuth) {
      if (route !== 'login') {
        super.navigateTo(route);
      } else {
        super.navigateTo(ROUTES.Start, isSave);
      }
    }
    if (!isAuth) {
      super.navigateTo('login', isSave);
    }
  }
}
