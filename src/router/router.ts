import Router, { type Route } from '@/lib/router.ts';
import { ROUTES } from '@/router/pathes.ts';
import type BaseComponent from '@/components/base-component.ts';

export default function createRouter(routerOutlet: BaseComponent): Router {
  return new Router(
    [
      {
        name: ROUTES.Login,
        component: async () => {
          const { default: createPage } = await import('@/features/unauthorizedLayout.ts');
          return createPage();
        },
      },
      {
        name: ROUTES.Info,
        component: async () => {
          const { default: createPage } = await import('@/features/authorizedLayout.ts');
          return createPage();
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
}
