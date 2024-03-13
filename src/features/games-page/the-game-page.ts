import '@/features/games-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { type Round, type Word, type GameData, type GameFullData } from '@/types/types';
import { IMG_URL } from '@/shared/constants';
import { isNull, isUndefined, isHTMLElement } from '@/utils/common-validator';
import {
  createGameInfo,
  createHints,
  creatText,
  creatGameField,
  createGameWrapper,
} from '@/features/games-page/services/create-html-service';
import {
  dragStart,
  dragEnter,
  dragLeave,
  dragOver,
  drop,
  touchDrag,
  addAbsolute,
  removeAbsolute,
  changeWidth,
  changeColParent,
} from '@/features/games-page/services/drag-and-drop-service';
import { getStyles, changePuzzleHead, createData } from '@/features/games-page/services/game-service';

const splitText = (text: string, operator: string): string[] => {
  const data = text.split(operator);
  return data;
};

class GamePage extends BaseComponent {
  private readonly text: BaseComponent;
  private readonly hints: BaseComponent;
  private readonly gameWrapper: BaseComponent;
  private readonly gameField: BaseComponent;
  private readonly curRow: ChildNode;
  private readonly wordsContainer: BaseComponent;
  private readonly containers: HTMLElement[];
  private readonly currentPoint: number;
  private readonly data: Round;

  private puzzle: HTMLElement | null;
  private puzzleParent: ParentNode | null;
  private gameData: Record<number, GameFullData>;

  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['game'], {});

    this.currentPoint = 1;
    this.puzzle = null;
    this.puzzleParent = null;
    this.gameData = {};
    this.data = store.game.getActiveGame();

    const gameInfo = createGameInfo(this.data);
    this.hints = createHints();
    this.text = creatText();
    const headGame = new BaseComponent('div', ['head']);
    headGame.append(this.text, this.hints);

    this.gameWrapper = createGameWrapper();
    const url = `${IMG_URL}${this.data.levelData.cutSrc}`;
    this.gameField = creatGameField(url);

    this.curRow = this.selectRow();
    this.wordsContainer = new BaseComponent('div', ['words-container']);
    this.containers = [];

    this.gameWrapper.append(this.gameField, this.wordsContainer);

    this.append(gameInfo, headGame, this.gameWrapper);
    const resizeObserver = new ResizeObserver(() => {
      this.changeWidthImg(this.currentPoint - 1).catch(() => {});
    });

    resizeObserver.observe(this.gameField.getElement());

    this.fillData();
  }

  private selectRow(): ChildNode {
    const game = this.gameField.getElement();
    const el = game.childNodes[this.currentPoint - 1];
    if (isUndefined(el)) {
      throw new Error('is undefined');
    }
    return el;
  }

  private selectSentence(i: number): Word {
    const sentense = this.data.words[i];
    if (sentense === undefined) {
      throw new Error('is undefined');
    }

    return sentense;
  }

  private changeText(): void {
    const data = this.gameData[this.currentPoint - 1];
    if (!isUndefined(data) && !isNull(data)) {
      const text = data.levelData.textExampleTranslate;
      this.text.setTextContent(text);
    }
  }

  private addPuzzleImg(
    word: BaseComponent,
    el: GameData,
    sumWidth: number,
    imgWidth: string,
    imgHeight: string,
    isLast: boolean,
  ): number {
    const rowWidth = imgWidth.slice(0, -2);
    const rowHeight = Number(imgHeight.slice(0, -2)) / 10;
    let copySum = sumWidth;

    if (!isNull(el.widthPercents) && typeof el.widthPercents === 'number') {
      const widthPixels = (Number(rowWidth) * Number(el.widthPercents)) / 100;
      const heightPixels = rowHeight * (this.currentPoint - 1);
      const url = `${IMG_URL}${this.data.levelData.cutSrc}`;
      word.setAttributes({
        style: `background-position-y: ${-heightPixels}px; background-position-x: ${-sumWidth}px; background-size: ${imgWidth} ${imgHeight}; background-repeat: no-repeat; background-image: url(${url});`,
      });
      copySum += widthPixels;

      changePuzzleHead(copySum, heightPixels, rowHeight, word, url, imgWidth, imgHeight, isLast);
    }
    return copySum;
  }

  private async changeWidthImg(idx: number): Promise<void> {
    const data = this.gameData[idx];
    if (!isNull(data) && !isUndefined(data)) {
      const words = data.wordsFullData;
      const imageField = this.gameField.getElement();
      const styles = await getStyles(imageField);
      let sumWidth = 0;

      words.forEach((el, i) => {
        const isLast = i === words.length - 1;
        if (!isNull(el.node)) {
          sumWidth = this.addPuzzleImg(el.node, el, sumWidth, styles.width, styles.height, isLast);
        }
      });
    }
  }

  private createHtmlWords(idx: number): void {
    const data = this.gameData[idx];
    if (!isNull(data) && !isUndefined(data)) {
      const words = data.wordsFullData;

      const arrWords = new BaseComponent('div');

      words.forEach((el, i) => {
        const word = new BaseComponent(
          'div',
          ['col-img'],
          { id: el.id, draggable: 'true', 'data-width': `${el.widthPercents}%` },
          el.word,
        );
        if (i > 0) {
          word.setClasses(['tail-puzzle']);
        }
        const colResult = new BaseComponent('div', ['col', 'col-target'], { id: `target-${i}` });
        const colContainer = new BaseComponent('div', ['col', 'col-container'], { id: `container-${i}` });
        this.curRow.appendChild(colResult.getElement());
        this.containers.push(colContainer.getElement());
        this.wordsContainer.append(colContainer);
        const wordData = words[i];
        if (!isUndefined(wordData)) {
          wordData.node = word;
        }
        arrWords.append(word);
        this.handlerPuzzle(word);
        this.handlerTouch(word);
        this.handleCol(colResult);
        this.handleCol(colContainer);
      });
      this.changeWidthImg(idx)
        .then(() => {
          this.changeToRandom(arrWords);
        })
        .catch(() => {});
    }
  }

  private handlerTouch(wordPuzzle: BaseComponent): void {
    let newParent: HTMLElement | null | undefined;
    wordPuzzle.addListener('touchstart', (event: Event): void => {
      if (!isNull(event.target) && isHTMLElement(event.target)) {
        this.puzzle = event.target;
        this.puzzleParent = event.target.parentNode;
      }
    });
    wordPuzzle.addListener('touchmove', (event: Event): void => {
      event.preventDefault();
      if (isHTMLElement(this.puzzle)) {
        addAbsolute(event, this.puzzle, this.puzzleParent, this.gameWrapper);
        newParent = touchDrag(this.puzzle, this.curRow, this.puzzleParent);
      }
    });
    wordPuzzle.addListener('touchend', (): void => {
      if (isHTMLElement(this.puzzle) && isHTMLElement(this.puzzleParent)) {
        if (!isUndefined(newParent) && !isNull(newParent)) {
          const child = newParent.firstChild;
          if (isHTMLElement(child) && this.puzzleParent.classList.contains('col-container')) {
            removeAbsolute(this.puzzle);
            return;
          }
          if (isHTMLElement(child) && this.puzzleParent.classList.contains('col-target')) {
            this.puzzleParent.append(child);
            changeWidth(this.puzzleParent, child);
            newParent.append(this.puzzle);
            removeAbsolute(this.puzzle);
            changeWidth(newParent, this.puzzle);
            return;
          }
          newParent.append(this.puzzle);
          removeAbsolute(this.puzzle);
          changeWidth(newParent, this.puzzle, this.puzzleParent);
        } else {
          removeAbsolute(this.puzzle);
        }
      }
    });
  }

  private handlerPuzzle(wordPuzzle: BaseComponent): void {
    wordPuzzle.addListener('click', (event: Event): void => {
      if (!isNull(event.target) && isHTMLElement(event.target)) {
        const parent = event.target.parentNode;
        if (!isNull(parent) && isHTMLElement(parent)) {
          if (parent.classList.contains('col-target')) {
            const colParent = this.wordsContainer.getElement();
            changeColParent(colParent.childNodes, event.target, parent);
          }
        }
        if (!isNull(parent) && isHTMLElement(parent)) {
          if (parent.classList.contains('col-container')) {
            changeColParent(this.curRow.childNodes, event.target, parent);
          }
        }
      }
    });

    wordPuzzle.addListener('dragstart', (event: Event): void => {
      dragStart(event);
      if (!isNull(event.target) && isHTMLElement(event.target)) {
        this.puzzle = event.target;
        this.puzzleParent = event.target.parentNode;
        this.puzzle.style.zIndex = '1';
      }
    });

    wordPuzzle.addListener('dragend', (): void => {
      if (!isNull(this.puzzle)) {
        this.puzzle.classList.remove('hide');
      }
    });
  }

  private handleCol(col: BaseComponent): void {
    col.addListener('dragover', (event: Event): void => {
      if (!isNull(this.puzzle)) {
        dragOver(event, this.puzzle);
      }
    });

    col.addListener('dragenter', (event) => {
      dragEnter(event);
    });

    col.addListener('dragleave', (event) => {
      dragLeave(event);
    });

    col.addListener('drop', (event) => {
      if (!isNull(this.puzzle) && isHTMLElement(event.target)) {
        if (!isNull(this.puzzleParent)) {
          drop(event, this.puzzle, this.puzzleParent);
        }
      }
    });
  }

  private changeToRandom(arrWords: BaseComponent): void {
    const parent = arrWords.getElement();
    const children = Array.from(parent.childNodes);
    children.sort(() => Math.random() - 0.5);

    const { length } = children;
    let idx = 0;

    while (idx < length) {
      const el = children[idx];

      const colParent = this.containers[idx];

      if (!isUndefined(el) && isHTMLElement(el) && !isUndefined(colParent)) {
        changeWidth(colParent, el);
        colParent.append(el);
        idx += 1;
      }
    }
  }

  private changeWords(lvlId: string, i: number): { data: Word; wordsFullData: GameData[] } {
    const data = this.selectSentence(i);
    const words = splitText(data?.textExample, ' ');
    const wordsFullData: GameData[] = words.map((el, idx) => ({
      id: `img_${lvlId}_${i}_${idx}`,
      word: el,
      length: el.length,
      widthPercents: 1,
      node: null,
    }));
    return { data, wordsFullData };
  }

  private fillData(): void {
    let i = 0;
    const lvlId = this.data.levelData.id;
    const fillDataRecursively = (): void => {
      if (i >= this.currentPoint) {
        this.changeText();
        return;
      }

      const { data, wordsFullData } = this.changeWords(lvlId, i);
      createData(data.textExample, wordsFullData, this.gameField)
        .then(() => {
          const sentense: GameFullData = { levelData: data, wordsFullData };
          this.gameData[i] = sentense;
          this.createHtmlWords(i);
          i += 1;
          fillDataRecursively();
        })
        .catch(() => {});
    };

    fillDataRecursively();
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamePage(fn);
  return page;
};

export default createPage;
