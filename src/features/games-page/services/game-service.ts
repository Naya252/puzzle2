import { fetchLevelData } from '@/repository/game-repository';
import { type NumLevel } from '@/types/types';
import store from '@/store/store';
import { isNull, isUndefined } from '@/utils/common-validator';

export async function getLevel(lvl: NumLevel): Promise<boolean> {
  const levelData = await fetchLevelData(lvl);
  store.game.setLevelData(levelData, lvl);
  return true;
}

export function initDefaultGame(lvl: NumLevel): void {
  const levelData = store.game.getLevelData(lvl);
  if (!isNull(levelData)) {
    const { rounds } = levelData;

    const round = rounds[0];
    if (!isUndefined(round)) {
      store.game.setActiveGame(round);
    }
  }
}
