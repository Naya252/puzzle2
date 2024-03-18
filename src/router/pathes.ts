export const ROUTES = {
  Start: 'start',
  Games: 'games',
  Game: 'game',
  Login: 'login',
} as const;

type AppRoute = (typeof ROUTES)[keyof typeof ROUTES] | '404';

export type { AppRoute };
