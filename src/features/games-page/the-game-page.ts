import '@/features/games-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { type Round, type Word, type GameData, type GameFullData, type NumSentence } from '@/types/types';
import { IMG_URL } from '@/shared/constants';
import { isNull, isUndefined, isHTMLElement, isNumSentence, isNumLevel } from '@/utils/common-validator';
import {
  createGameInfo,
  changeTitle,
  createHints,
  createText,
  creatGameField,
  changeGamefield,
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
import { getStyles, changePuzzleHead, createData, getLevel } from '@/features/games-page/services/game-service';
import BaseButton from '@/components/base-button/base-button';

const splitText = (text: string, operator: string): string[] => {
  const data = text.split(operator);
  return data;
};

class GamePage extends BaseComponent {
  private readonly gameInfo: BaseComponent;
  private readonly text: BaseComponent;
  private readonly hints: BaseComponent;
  private readonly gameWrapper: BaseComponent;
  private readonly gameField: BaseComponent;
  private curRow: ChildNode;
  private readonly arrWords: BaseComponent;
  private readonly wordsContainer: BaseComponent;
  private containers: HTMLElement[];
  private currentPoint: NumSentence;
  private data: Round;
  private readonly checkBtn: BaseButton;
  private readonly autoCompleteBtn: BaseButton;

  private puzzle: HTMLElement | null;
  private puzzleParent: ParentNode | null;
  private gameData: Record<number, GameFullData>;

  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['game'], {});
    this.puzzle = null;
    this.puzzleParent = null;
    this.gameData = {};
    this.data = store.game.getActiveGame();
    this.currentPoint = store.game.getActiveSentence();
    this.arrWords = new BaseComponent('div');

    this.gameInfo = createGameInfo(this.data);
    this.hints = createHints();
    this.text = createText();
    const headGame = new BaseComponent('div', ['head']);
    headGame.append(this.text, this.hints);

    this.gameWrapper = createGameWrapper();
    const url = this.getUrl();
    this.gameField = creatGameField(url);

    this.curRow = this.selectRow(0);
    this.wordsContainer = new BaseComponent('div', ['words-container']);
    this.containers = [];

    this.gameWrapper.append(this.gameField, this.wordsContainer);

    const btnContainer = new BaseComponent('div', ['buttons-container']);
    this.checkBtn = new BaseButton('button', 'Check', ['check-btn', 'outlined'], { disabled: 'true' });
    this.checkListener();
    this.autoCompleteBtn = new BaseButton('button', `I don't know`, ['autocomplete-btn', 'outlined']);
    this.autocompleteListener();
    btnContainer.append(this.autoCompleteBtn, this.checkBtn);

    this.append(this.gameInfo, headGame, this.gameWrapper, btnContainer);
    const resizeObserver = new ResizeObserver(() => {
      this.changeWidthImg(this.currentPoint).catch(() => {});
    });
    resizeObserver.observe(this.gameField.getElement());
    this.initFirstGame().catch(() => {});
  }

  private getUrl(): string {
    const url = `${IMG_URL}${this.data.levelData.cutSrc}`;
    return url;
  }

  private checkListener(): void {
    this.checkBtn.addListener('click', (e) => {
      if (!isNull(e.target) && isHTMLElement(e.target)) {
        if (e.target.textContent === 'Check') {
          const isCorrect = this.isCorrectSentense();
          if (isCorrect) {
            this.changeWinData(isCorrect);
          }
        } else {
          this.changeToDefault();
          this.changeCurrentPoint();
        }
      }
    });
  }

  private addBlock(i: NumSentence): void {
    const data = this.gameData[i];
    if (!isUndefined(data) && !isNull(data)) {
      const words = data.wordsFullData;
      words.forEach((el) => {
        const child = el.node;
        child?.setClasses(['block']);
      });
    }
  }

  private changeWinData(isWin: boolean): void {
    const data = this.gameData[this.currentPoint];
    if (!isUndefined(data) && !isNull(data)) {
      const { levelData } = data;
      levelData.isWin = isWin;
      this.continueGame();
    }
  }

  private async initFirstGame(i = 0): Promise<void> {
    if (i < this.currentPoint) {
      if (isNumSentence(i)) {
        this.curRow = this.selectRow(i);
        await this.fillData(i);

        this.createHtmlWords(i);
        await this.changeWidthImg(i);
        this.changeToRandom(this.arrWords);
        this.completeSentence(i);
        this.addBlock(i);
      }
      await this.initFirstGame(i + 1);
    } else {
      this.startNewGame().catch(() => {});
    }
  }

  private changeToDefault(): void {
    const autoCompleteBtn = this.autoCompleteBtn.getElement();
    autoCompleteBtn.removeAttribute('disabled');

    const checkBtn = this.checkBtn.getElement();
    checkBtn.setAttribute('disabled', 'true');
    checkBtn.textContent = 'Check';
    checkBtn.classList.remove('continue');
    checkBtn.classList.remove('moveArrow');

    const arr = Array.from(this.curRow.childNodes);
    arr.forEach((el) => {
      const img = el.firstChild;
      if (img !== null) {
        if (img instanceof HTMLElement) {
          img.classList.remove('valid');
          img.classList.remove('invalid');
        }
      }
    });
  }

  private goTonextRound(): void {
    const curLvl = store.game.getActiveLevel();
    const levelData = store.game.getLevelData(curLvl);

    if (!isNull(levelData)) {
      const curRound = store.game.getActiveRound();
      const nextRound = curRound + 1;
      const { rounds } = levelData;

      if (rounds.length === nextRound) {
        this.changeLevel();
      } else {
        const round = rounds[nextRound];

        if (isUndefined(round)) {
          return;
        }
        this.changeRound(nextRound, round);
      }
    }
  }

  private changeLevel(): void {
    const curLvl = store.game.getActiveLevel();
    let lvl = 0;
    if (curLvl < 5) {
      lvl = curLvl + 1;
    }
    if (!isNumLevel(lvl)) {
      return;
    }
    getLevel(lvl)
      .then(() => {
        const levelData = store.game.getLevelData(lvl);

        if (!isNull(levelData)) {
          const { rounds } = levelData;
          const round = rounds[0];

          if (!isUndefined(round) && isNumLevel(lvl)) {
            store.game.setActiveLevel(lvl);
            store.game.setActiveRound(0);
            store.game.setActiveGame(round);
            store.game.setActiveSentence(0);
            this.currentPoint = store.game.getActiveSentence();
            this.data = store.game.getActiveGame();
            this.containers = [];
            const url = this.getUrl();
            changeGamefield(url, this.gameField);
            this.startNewGame().catch(() => {});
            changeTitle(this.gameInfo, this.data);
          }
        }
      })
      .catch(() => {});
  }

  private changeRound(nextRound: number, round: Round): void {
    store.game.setActiveRound(nextRound);
    store.game.setActiveGame(round);

    this.data = store.game.getActiveGame();

    store.game.setActiveSentence(0);
    this.currentPoint = store.game.getActiveSentence();
    this.containers = [];
    const url = this.getUrl();
    changeGamefield(url, this.gameField);
    this.startNewGame().catch(() => {});
    changeTitle(this.gameInfo, this.data);
  }

  private changeCurrentPoint(): void {
    this.currentPoint += 1;
    if (isNumSentence(this.currentPoint)) {
      store.game.setActiveSentence(this.currentPoint);
      this.startNewGame().catch(() => {});
    } else {
      this.goTonextRound();
    }
  }

  private async startNewGame(): Promise<void> {
    this.curRow = this.selectRow(this.currentPoint);
    await this.fillData(this.currentPoint);

    this.createHtmlWords(this.currentPoint);
    await this.changeWidthImg(this.currentPoint);
    this.changeToRandom(this.arrWords);

    this.changeText();
  }

  private continueGame(): void {
    this.addBlock(this.currentPoint);
    this.autoCompleteBtn.setAttributes({ disabled: 'true' });
    this.checkBtn.setClasses(['continue']);
    setTimeout(() => {
      this.checkBtn.setClasses(['moveArrow']);
    }, 300);
    const checkBtn = this.checkBtn.getElement();
    checkBtn.removeAttribute('disabled');
    checkBtn.textContent = 'Continue';
  }

  private autocompleteListener(): void {
    this.autoCompleteBtn.addListener('click', () => {
      this.completeSentence(this.currentPoint);
      this.isCorrectSentense();
      this.changeWinData(false);
    });
  }

  private completeSentence(idx: NumSentence): void {
    const data = this.gameData[idx];
    if (!isUndefined(data) && !isNull(data)) {
      const words = data.wordsFullData;
      const cols = Array.from(this.curRow.childNodes);
      cols.forEach((el, i) => {
        const child = words[i]?.node;
        const elChild = child?.getElement();
        if (!isUndefined(elChild) && isHTMLElement(el)) {
          el.appendChild(elChild);
          changeWidth(el, elChild);
        }
      });
    }
  }

  private isFullSentence(): void {
    const arr = Array.from(this.curRow.childNodes);
    const isFull = arr.every((el) => {
      const img = el.firstChild;
      return !isNull(img);
    });

    const btn = this.checkBtn.getElement();

    if (isFull) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'true');
    }
  }

  private isCorrectSentense(): boolean {
    const arr = Array.from(this.curRow.childNodes);
    const isCorrect = arr.every((el, i) => {
      const img = el.firstChild;
      if (img !== null) {
        if (img instanceof HTMLElement) {
          const id = img.id.split('_');
          return Number(id[id.length - 1]) === i;
        }
      }
      return false;
    });

    arr.forEach((el, i) => {
      const img = el.firstChild;
      if (img !== null) {
        if (img instanceof HTMLElement) {
          const id = img.id.split('_');
          if (Number(id[id.length - 1]) === i) {
            img.classList.remove('invalid');
            img.classList.add('valid');
          } else {
            img.classList.remove('valid');
            img.classList.add('invalid');
          }
        }
      }
    });

    return isCorrect;
  }

  private selectRow(i: NumSentence): ChildNode {
    const game = this.gameField.getElement();
    const el = game.childNodes[i];
    if (isUndefined(el)) {
      throw new Error('is undefined');
    }
    return el;
  }

  private selectSentence(i: NumSentence): Word {
    const sentense = this.data.words[i];
    if (sentense === undefined) {
      throw new Error('is undefined');
    }

    return sentense;
  }

  private changeText(): void {
    const data = this.gameData[this.currentPoint];
    if (!isUndefined(data) && !isNull(data)) {
      const text = data.levelData.textExampleTranslate;
      this.text.setTextContent(text);
    }
  }

  private addPuzzleImg(
    idx: NumSentence,
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
      const heightPixels = rowHeight * idx;
      const url = this.getUrl();
      word.setAttributes({
        style: `background-position-y: ${-heightPixels}px; background-position-x: ${-sumWidth}px; background-size: ${imgWidth} ${imgHeight}; background-repeat: no-repeat; background-image: url(${url});`,
      });
      copySum += widthPixels;

      changePuzzleHead(copySum, heightPixels, rowHeight, word, url, imgWidth, imgHeight, isLast);
    }
    return copySum;
  }

  private async changeWidthImg(idx: NumSentence): Promise<void> {
    const data = this.gameData[idx];
    if (!isNull(data) && !isUndefined(data)) {
      const words = data.wordsFullData;
      const imageField = this.gameField.getElement();
      const styles = await getStyles(imageField);
      let sumWidth = 0;

      words.forEach((el, i) => {
        const isLast = i === words.length - 1;
        if (!isNull(el.node)) {
          sumWidth = this.addPuzzleImg(idx, el.node, el, sumWidth, styles.width, styles.height, isLast);
        }
      });
    }
  }

  private createHtmlWords(idx: NumSentence): void {
    const data = this.gameData[idx];
    this.wordsContainer.setHTML('');
    this.arrWords.setHTML('');

    if (!isNull(data) && !isUndefined(data)) {
      const words = data.wordsFullData;

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
        const colResult = new BaseComponent('div', ['col', 'col-target'], { id: `target-${idx}-${i}` });
        const colContainer = new BaseComponent('div', ['col', 'col-container'], { id: `container-${i}` });
        this.curRow.appendChild(colResult.getElement());

        this.containers.push(colContainer.getElement());
        this.wordsContainer.append(colContainer);

        const wordData = words[i];
        if (!isUndefined(wordData)) {
          wordData.node = word;
        }
        this.arrWords.append(word);

        this.handlerPuzzle(word);
        this.handlerTouch(word);
        this.handleCol(colResult);
        this.handleCol(colContainer);
      });
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
          changeWidth(newParent, this.puzzle, this.puzzleParent);
        }
        removeAbsolute(this.puzzle);
      }
      this.isFullSentence();
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

        this.isFullSentence();
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
        this.isFullSentence();
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
    const colParents = this.wordsContainer.getElement();

    children.sort(() => Math.random() - 0.5);

    const { length } = children;
    let idx = 0;

    while (idx < length) {
      const el = children[idx];
      const colParent = colParents.childNodes[idx];

      if (!isUndefined(el) && isHTMLElement(el) && !isUndefined(colParent) && isHTMLElement(colParent)) {
        changeWidth(colParent, el);
        colParent.append(el);

        idx += 1;
      }
    }
  }

  private changeWords(lvlId: string, i: NumSentence): { data: Word; wordsFullData: GameData[] } {
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

  private async fillData(i: NumSentence): Promise<void> {
    const lvlId = this.data.levelData.id;
    const { data, wordsFullData } = this.changeWords(lvlId, i);

    await createData(data.textExample, wordsFullData, this.gameField);
    const sentense: GameFullData = { levelData: data, wordsFullData };
    this.gameData[i] = sentense;
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamePage(fn);
  return page;
};

export default createPage;
