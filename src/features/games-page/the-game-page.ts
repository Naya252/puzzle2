import '@/features/games-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { type Round } from '@/types/types';
import { IMG_URL } from '@/repository/game-repository';
import { isNull, isUndefined, isHTMLElement } from '@/utils/common-validator';

const createGameInfo = (data: Round): BaseComponent => {
  const gameInfo = new BaseComponent('div', ['info'], {});
  const lvl = new BaseComponent('h1', ['lvl'], {}, `Level ${store.game.getActiveLevel()}:`);
  const name = new BaseComponent('h2', ['name'], {}, `${data.levelData.name}`);
  gameInfo.append(lvl);
  gameInfo.append(name);
  return gameInfo;
};

const createHints = (): BaseComponent => {
  const hints = new BaseComponent('div', ['hints'], {}, 'hints');
  return hints;
};

const creatText = (): BaseComponent => {
  const text = new BaseComponent('p', ['text'], {}, 'text');
  return text;
};

const creatGameField = (url: string): BaseComponent => {
  const gameField = new BaseComponent('div', ['game-field']);
  const game = gameField.getElement();
  game.style.background = `#464849 center / contain no-repeat url(${url})`;

  let i = 0;
  while (i < 10) {
    i += 1;
    const row = new BaseComponent('div', ['row', 'row-img'], { id: `row-${i}` });
    gameField.append(row);
  }

  return gameField;
};

const splitText = (text: string, operator: string): string[] => {
  const data = text.split(operator);
  return data;
};

const dragStart = (event: Event): void => {
  if (
    event instanceof DragEvent &&
    !isNull(event.dataTransfer) &&
    !isNull(event.target) &&
    isHTMLElement(event.target)
  ) {
    event.dataTransfer.setData('text', event.target.id);
  }
};

const dragOver = (event: Event): void => {
  if (!isNull(event.target) && isHTMLElement(event.target)) {
    if (event.target.classList.contains('col-img')) {
      return;
    }
    event.preventDefault();
  }
};

const drop = (event: Event, puzzle: HTMLElement): void => {
  event.preventDefault();

  if (
    event instanceof DragEvent &&
    !isNull(event.dataTransfer) &&
    !isNull(event.target) &&
    isHTMLElement(event.target)
  ) {
    event.target.appendChild(puzzle);
  }
};

const changeWidth = (col: HTMLElement, puzzle: HTMLElement, lastParent: HTMLElement | null = null): void => {
  const colCopy = col;
  const copyLastParent = lastParent;
  const width = puzzle.getAttribute('data-width');
  if (typeof width === 'string') {
    colCopy.style.maxWidth = width;
    colCopy.style.minWidth = width;

    if (!isNull(copyLastParent)) {
      copyLastParent.style.maxWidth = 'none';
      copyLastParent.style.minWidth = 'initial';
    }

    puzzle.classList.add('puzzle-scale');
    setTimeout(() => {
      puzzle.classList.remove('puzzle-scale');
    });
  }
};

const changeColParent = (childNodes: NodeList, evtTarget: HTMLElement, lastParent: HTMLElement): void => {
  const array = Array.from(childNodes);
  const target = array.find((element) => element.childNodes.length === 0);
  if (isHTMLElement(target)) {
    changeWidth(target, evtTarget, lastParent);
    target?.appendChild(evtTarget);
  }
};

class GamePage extends BaseComponent {
  private readonly text: BaseComponent;
  private readonly hints: BaseComponent;
  private readonly gameField: BaseComponent;
  private readonly curRow: ChildNode;
  private readonly wordsContainer: BaseComponent;
  private readonly containers: HTMLElement[];
  private currentPoint: number;
  private readonly data: Round;
  private words: string[];
  private puzzle: HTMLElement | null;

  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['game'], {});

    this.currentPoint = 1;
    this.words = [];
    this.puzzle = null;
    this.data = store.game.getActiveGame();

    const gameInfo = createGameInfo(this.data);
    this.hints = createHints();
    this.text = creatText();
    const headGame = new BaseComponent('div', ['head']);
    headGame.append(this.text, this.hints);

    const url = `${IMG_URL}${this.data.levelData.cutSrc}`;
    this.gameField = creatGameField(url);
    this.curRow = this.selectRow();
    this.wordsContainer = new BaseComponent('div', ['words-container']);
    this.containers = [];

    this.append(gameInfo, headGame, this.gameField, this.wordsContainer);

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
      const colResult = new BaseComponent('div', ['col', 'col-target'], { id: `target-${i}` });
      const colContainer = new BaseComponent('div', ['col', 'col-container'], { id: `container-${i}` });

      this.curRow.appendChild(colResult.getElement());
      this.containers.push(colContainer.getElement());

      this.wordsContainer.append(colContainer);
      this.calculateWidthWord(word, el);
      arrWords.append(word);

      this.handlerPuzzle(word);
      this.handleCol(colResult);
    });

    this.changeToRandom(arrWords);
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
      }
    });
  }

  private handleCol(col: BaseComponent): void {
    col.addListener('dragover', (event: Event): void => {
      dragOver(event);
    });
    col.addListener('drop', (event) => {
      if (!isNull(this.puzzle) && isHTMLElement(event.target)) {
        changeWidth(event.target, this.puzzle);
        drop(event, this.puzzle);
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
