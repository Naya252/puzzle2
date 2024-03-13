import { type NumLevel, type RoundsData } from '@/types/types';
import { DATA_URL } from '@/shared/constants';
import { isRoundsData } from './validation';

export default async function fetchLevelData(level: NumLevel): Promise<RoundsData> {
  try {
    const response = await fetch(`${DATA_URL}${level}.json`);
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
