import fetchLevelData from '@/repository/game-repository';
import { type NumLevel, type GameData, type NumSentence } from '@/types/types';
import store from '@/store/store';
import { isNull, isUndefined } from '@/utils/common-validator';
import type BaseComponent from '@/components/base-component';

export async function getLevel(lvl: NumLevel): Promise<boolean> {
  const levelData = await fetchLevelData(lvl);
  store.game.setLevelData(levelData, lvl);
  return true;
}

export function initDefaultGame(lvl: NumLevel, curRound = 0, curSentence: NumSentence = 0): void {
  const levelData = store.game.getLevelData(lvl);
  if (!isNull(levelData)) {
    const { rounds } = levelData;

    if (curRound < rounds.length) {
      const round = rounds[curRound];
      if (!isUndefined(round)) {
        store.game.setActiveGame(round);
        store.game.setActiveSentence(curSentence);
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
  const width48Px = 48 / onePercentPx;
  let newMax = max;
  data.forEach((el) => {
    if (!isNull(el.widthPercents)) {
      if (el.widthPercents < width48Px) {
        newMax += el.widthPercents;
        const copy = el;
        copy.widthPercents = width48Px;
        newMax -= width48Px;
      }
    }
  });
  const changedMax = data.find((el) => el.widthPercents === max);
  if (!isUndefined(changedMax)) {
    changedMax.widthPercents = newMax;
  }
}
