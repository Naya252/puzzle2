export const ROUTES = {
  Login: 'login',
  Info: 'info',
} as const;

type AppRoute = (typeof ROUTES)[keyof typeof ROUTES] | '404';

export type { AppRoute };
