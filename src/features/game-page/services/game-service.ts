import fetchLevelData from '@/repository/game-repository';
import { getCompletedRounds, setCompletedLevels, setCompletedRounds } from '@/repository/user-repository';
import { type NumLevel, type GameData } from '@/types/types';
import store from '@/store/store';
import { isNull, isUndefined } from '@/utils/common-validator';
import type BaseComponent from '@/components/base-component';
import type BaseButton from '@/components/base-button/base-button';

export async function getLevel(lvl: NumLevel): Promise<boolean> {
  const levelData = await fetchLevelData(lvl);
  store.game.setLevelData(levelData, lvl);
  return true;
}

export function initDefaultGame(lvl: NumLevel, curRound = 0): void {
  const levelData = store.game.getLevelData(lvl);
  if (!isNull(levelData)) {
    const { rounds } = levelData;

    if (curRound < rounds.length) {
      const round = rounds[curRound];
      if (!isUndefined(round)) {
        store.game.setActiveGame(round);
      }
    }
  }
}

export async function getStyles(item: HTMLElement): Promise<{ width: string; height: string }> {
  const styles = await new Promise<{ width: string; height: string }>((resolve) => {
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(item);
      const width = computedStyle.getPropertyValue('width');
      const height = computedStyle.getPropertyValue('height');

      resolve({ width, height });
    }, 0);
  });
  return styles;
}

export function changePuzzleHead(
  width: number,
  height: number,
  rowHeight: number,
  word: BaseComponent,
  url: string,
  imgWidth: string,
  imgHeight: string,
  isLast: boolean,
): void {
  if (!isLast) {
    const elWord = word.getElement();
    const data = elWord.getAttribute('id');
    if (!isNull(data)) {
      const existingStyleElement = document.getElementById(`style_${data}`);
      if (!isNull(existingStyleElement)) {
        existingStyleElement?.remove();
      }
      const style = document.createElement('style');
      style.id = `style_${data}`;
      const positionHeight = height + rowHeight / 2 - 8;
      style.innerHTML = `
              #${data}::after {
                position: absolute; top: calc(50% - 8px); right: -8px;
                content: ''; width: 8px; height: 16px;
                border-radius: 0 50% 50% 0;
                background-color: #2b3035;
                z-index: 3;
                background-position-y: ${-positionHeight}px;
                background-position-x: ${-width}px;
                background-size: ${imgWidth} ${imgHeight};
                background-repeat: no-repeat; background-image: url(${url});
                border: 1px solid #dee2e6;
                border-left: none
              }
            `;
      document.head.appendChild(style);
    }
  }
}

export async function createData(
  textExample: string,
  wordsFullData: GameData[],
  gameField: BaseComponent,
): Promise<void> {
  const data = wordsFullData;
  const lettersCount = textExample.split(' ').join('').length;

  const imageField = gameField.getElement();
  const styles = await getStyles(imageField);
  const imgWidth = styles.width;

  data.forEach((el) => {
    const copyEl = el;
    copyEl.widthPercents = (el.length / lettersCount) * 100;
  });

  const max = Math.max(...data.map((el) => el.widthPercents));
  const onePercentPx = Number(imgWidth.slice(0, -2)) / 100;

  const minWidth = calcMinWidth() / onePercentPx;
  let newMax = max;
  data.forEach((el) => {
    if (!isNull(el.widthPercents)) {
      if (el.widthPercents < minWidth) {
        newMax += el.widthPercents;
        const copy = el;
        copy.widthPercents = minWidth;
        newMax -= minWidth;
      }
    }
  });
  const changedMax = data.find((el) => el.widthPercents === max);
  if (!isUndefined(changedMax)) {
    changedMax.widthPercents = newMax;
  }
}

function calcMinWidth(): number {
  const windowInnerWidth = window.innerWidth;
  if (windowInnerWidth > 1000) {
    return 48;
  }
  if (windowInnerWidth > 750) {
    return 28;
  }
  return 16;
}

export function changeDisabled(btn: BaseButton, toDisabled: boolean): void {
  const button = btn.getElement();
  if (toDisabled) {
    button.setAttribute('disabled', 'true');
  } else {
    button.removeAttribute('disabled');
  }
}

export function changeCompletedRounds(strRound: string): void {
  const allCompletedRounds = getCompletedRounds();
  if (!allCompletedRounds.includes(strRound)) {
    allCompletedRounds.push(strRound);
    setCompletedRounds(allCompletedRounds);
  }
}

export function changeCompletedLevels(numLevel: NumLevel): void {
  const allCompletedLevels = store.game.getCompletedLevels();
  if (!allCompletedLevels.includes(numLevel)) {
    store.game.setCompletedLevels(numLevel);
    setCompletedLevels(store.game.getCompletedLevels());
  }
}

export function checkCompletedLevel(roundsCount: number, curLvl: NumLevel): void {
  const allCompletedRounds = getCompletedRounds();
  const allCompletedRoundsByCurLvl = allCompletedRounds.filter((el) => el.includes(`${curLvl + 1}_`));
  if (roundsCount === allCompletedRoundsByCurLvl.length) {
    changeCompletedLevels(curLvl);
  }
}
