import '@/features/games-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { type Round } from '@/types/types';
import { IMG_URL } from '@/repository/game-repository';
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
  private currentPoint: number;
  private readonly data: Round;
  private words: string[];
  private puzzle: HTMLElement | null;
  private puzzleParent: ParentNode | null;

  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['game'], {});

    this.currentPoint = 1;
    this.words = [];
    this.puzzle = null;
    this.puzzleParent = null;
    this.data = store.game.getActiveGame();

    const gameInfo = createGameInfo(this.data);
    this.hints = createHints();
    this.text = creatText();
    const headGame = new BaseComponent('div', ['head']);
    headGame.append(this.text, this.hints);

    const url = `${IMG_URL}${this.data.levelData.cutSrc}`;
    this.gameWrapper = createGameWrapper();
    this.gameField = creatGameField(url);
    this.curRow = this.selectRow();
    this.wordsContainer = new BaseComponent('div', ['words-container']);
    this.containers = [];

    this.gameWrapper.append(this.gameField, this.wordsContainer);

    this.append(gameInfo, headGame, this.gameWrapper);

    this.selectSentence();
  }

  private selectRow(): ChildNode {
    const game = this.gameField.getElement();
    const el = game.childNodes[this.currentPoint - 1];
    if (isUndefined(el)) {
      throw new Error('is undefined');
    }
    return el;
  }

  private changePoint(): void {
    this.currentPoint += 1;
  }

  private selectSentence(): void {
    const sentense = this.data.words[this.currentPoint];
    if (sentense === undefined) {
      throw new Error('is undefined');
    }

    this.changeText(sentense?.textExampleTranslate);
    this.changeWords(sentense?.textExample);
  }

  private changeText(text: string): void {
    this.text.setTextContent(text);
  }

  private changeWords(text: string): void {
    this.words = splitText(text, ' ');
    this.createHtmlWords();
  }

  private createHtmlWords(): void {
    const arrWords = new BaseComponent('div');
    this.words.forEach((el, i) => {
      const word = new BaseComponent('div', ['col-img'], { id: `img-${i}`, draggable: 'true' }, el);
      if (i > 0) {
        word.setClasses(['tail-puzzle']);
      }
      if (i !== this.words.length - 1) {
        word.setClasses(['head-puzzle']);
      }
      const colResult = new BaseComponent('div', ['col', 'col-target'], { id: `target-${i}` });
      const colContainer = new BaseComponent('div', ['col', 'col-container'], { id: `container-${i}` });

      this.curRow.appendChild(colResult.getElement());
      this.containers.push(colContainer.getElement());

      this.wordsContainer.append(colContainer);
      this.calculateWidthWord(word, el);
      arrWords.append(word);

      this.handlerPuzzle(word);
      this.handlerTouch(word);
      this.handleCol(colResult);
      this.handleCol(colContainer);
    });

    this.changeToRandom(arrWords);
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
    const children = parent.childNodes;
    let { length } = children;
    let idx = 0;

    while (length > 0) {
      length -= 1;
      const curIdx = Math.floor(Math.random() * length);
      const el = children[curIdx];

      const colParent = this.containers[idx];

      if (!isUndefined(el) && isHTMLElement(el) && !isUndefined(colParent)) {
        changeWidth(colParent, el);
        colParent.append(el);
        idx += 1;
      }
    }
  }

  private calculateWidthWord(word: BaseComponent, text: string): void {
    const full = this.words.join('').length;
    const el = word.getElement();
    el.setAttribute('data-width', `${(text.length / full) * 100}%`);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamePage(fn);
  return page;
};

export default createPage;
