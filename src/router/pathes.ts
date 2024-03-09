export const ROUTES = {
  Login: 'login',
  Start: 'start',
  Games: 'games',
  Game: 'game',
  // Statistic: 'statistic',
} as const;

type AppRoute = (typeof ROUTES)[keyof typeof ROUTES] | '404';

export type { AppRoute };
