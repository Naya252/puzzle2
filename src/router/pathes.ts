export const ROUTES = {
  Login: 'login',
  Start: 'start',
} as const;

type AppRoute = (typeof ROUTES)[keyof typeof ROUTES] | '404';

export type { AppRoute };
