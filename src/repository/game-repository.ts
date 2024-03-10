import { type NumLevel, type RoundsData } from '@/types/types';
import { isRoundsData } from './validation';

const BASE_DATA_URL = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/`;

const URL = `${BASE_DATA_URL}data/wordCollectionLevel`;
export const IMG_URL = `${BASE_DATA_URL}images/`;

export async function fetchLevelData(level: NumLevel): Promise<RoundsData> {
  try {
    const response = await fetch(`${URL}${level}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data: unknown = await response.json();

    if (!isRoundsData(data)) {
      throw new Error('Failed to parse data');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}
