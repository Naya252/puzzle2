import store from '@/store/store.ts';

const BASE_DATA_URL = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/`;

const URL = `${BASE_DATA_URL}data/wordCollectionLevel`;
export const IMG_URL = `${BASE_DATA_URL}images/`;

export type NumLevel = 1 | 2 | 3 | 4 | 5 | 6;

export async function fetchLevelData(level: number): Promise<void> {
  try {
    const response = await fetch(`${URL}${level}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data: unknown = await response.json();
    store.game.SET_LEVEL_DATA(data, level);
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}
